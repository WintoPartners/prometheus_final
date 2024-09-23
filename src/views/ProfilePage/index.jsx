import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ICON } from "constant";

const PageContainer = styled.div`
  background-color: #1e1e1e;
  color: #fff;
  min-height: 100vh;
  padding: 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
`;

const CardContainer = styled.div`
  width: 100%;
  max-width: 1200px; 
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.div`
  background-color: #2c2c2c;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  position: relative;

  &:hover {
    background-color: #383838; 
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h2`
  margin: 0;
  color: #1e90ff;
`;

const CardSubTitle = styled.h3`
  margin: 0;
  color: #aaa;
  font-size: 1rem;
  margin-top: 5px;
`;

const CardBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const CardDetail = styled.div`
  display: flex;
  flex-direction: row; /* 변경: 가로로 배치 */
  gap: 20px; /* 항목 간격 추가 */
`;

const DetailItem = styled.div`
  font-size: 1rem;
  color: #ddd;
  background-color: #444;
  padding: 5px 10px;
  border-radius: 5px;
  margin-top: 5px;
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0;
  color:#b1b1b1;
  &:hover img {
    filter: brightness(0.8); // 마우스 오버 시 밝기 조정
  }

  & img {
    width: 24px; // 이미지 크기 조정
    height: 24px;
  }
`;

const StyledLink = styled(Link)`
  color: #1e90ff;
  text-decoration: none;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #666;
  }

  background-color: ${props => props.active ? '#777' : 'transparent'};
  border-radius: ${props => props.active ? '10px' : '0'};
  border: ${props => props.active ? 'none' : 'none'};
  box-shadow: ${props => props.active ? '0 2px 5px rgba(0,0,0,0.2)' : 'none'};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 1200px;
  margin-top: 10px;
  padding-right: 20px;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #333;
  border-radius: 5px;
  border: 1px solid #555;
  margin-top:10px;
  margin-right:-20px;
  padding: 8px;
`;

const SearchIcon = styled.img`
  width: 20px; /* 아이콘 크기 */
  height: 20px;
  margin-right: 8px; /* 입력 필드와의 간격 */
`;

const SearchInput = styled.input`
  background-color: transparent;
  border: none;
  color: #fff;
  outline: none;
`;

const ProposalTitle = styled.h1`
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: 36px;
`;

function ProfilePage() {
  const [proposals, setProposals] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProposals, setFilteredProposals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/proposals`, {
          method: 'GET',
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setProposals(data.proposals);
        } else {
          throw new Error('Failed to fetch proposals');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  const results = proposals.filter(proposal =>
    proposal.title && proposal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredProposals(results);
}, [searchTerm, proposals]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm('해당 제안서를 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/deleteProposal`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        if (response.ok) {
          window.location.reload();
        } else {
          throw new Error('Failed to delete the item');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProposals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageClick = (event, number) => {
    event.preventDefault();
    setCurrentPage(number);
  };

  const handleCardClick = (id) => {
    navigate(`/profileDetail/${id}`);
  };

  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

  return (
    <PageContainer>
      <ProposalTitle>제안서 생성 목록</ProposalTitle>
      <SearchContainer>
        <SearchWrapper>
          <SearchIcon src={ICON.SEARCH2} alt="검색" />
          <SearchInput
            type="text"
            placeholder="프로젝트 제목 검색"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchWrapper>
      </SearchContainer>
      <CardContainer>
        {currentItems.length > 0 ? (
          currentItems.map((proposal, index) => (
            <Card key={proposal.id} onClick={() => handleCardClick(proposal.id)}>
              <DeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(proposal.id); }}>
                <img src={ICON.CANCEL} alt="삭제" />
              </DeleteButton>
              <CardHeader>
                <div>
                  <CardTitle>
                    {proposal.title}
                  </CardTitle>
                  <CardSubTitle>
                    {proposal.agency}
                  </CardSubTitle>
                </div>
              </CardHeader>
              <CardBody>
                <CardDetail>
                  <DetailItem>예상 기간: {proposal.period}</DetailItem>
                  <DetailItem>예상 예산: {proposal.budget}만원</DetailItem>
                </CardDetail>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card>
            <CardBody>
              <div>생성한 제안서가 없습니다.</div>
            </CardBody>
          </Card>
        )}
      </CardContainer>
      <Pagination>
        {[...Array(totalPages).keys()].map(number => (
          <PageButton key={number + 1} active={currentPage === number + 1} onClick={(e) => handlePageClick(e, number + 1)}>
            {number + 1}
          </PageButton>
        ))}
      </Pagination>
    </PageContainer>
  );
}

export default ProfilePage;
