import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import * as Pages from "./views";
import StepperLayout from "layout/StepperLayout";

// 테스트용 단순 App 컴포넌트
const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<StepperLayout />}>
          <Route path="/loading" element={<Pages.LoadingPage />} />
          <Route path="/init" element={<Pages.InitPage />} />
          <Route path="/step/:type" element={<Pages.StepperPage />} />
          <Route path="/result" element={<Pages.ResultPage />} />
          <Route path="/profile" element={<Pages.ProfilePage />} />
          <Route path="/profileDetail/:id" element={<Pages.ProfileDetailPage />} />
          <Route path="/subscription" element={<Pages.SubscriptionPage />} />
          <Route path="/payment" element={<Pages.PaymentPage />} />
          <Route path="/success" element={<Pages.SuccessPage />} />
          <Route path="/fail" element={<Pages.FailPage />} />
          <Route path="/status" element={<Pages.StatusPage />} />
          <Route path="/" element={<Pages.LoginPage />} />
          <Route path="/oauth" element={<Pages.OAuthCallbackPage />} />
          <Route path="/noauth" element={<Pages.NaverCallbackPage />} />
          <Route path="/signup" element={<Pages.SignupPage />} />
          <Route path="/findId" element={<Pages.FindIdPage />} />
          <Route path="/findPassword" element={<Pages.FindPasswordPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
