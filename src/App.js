import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './views/ProtectedPage/AuthContext'; // AuthProvider를 임포트
import { AdminAuthProvider } from './views/AdminPage/AdminAuthContext'; // AdminAuthProvider 임포트
import * as Pages from "./views";
import * as AdminPages from './views/AdminPage';
import StepperLayout from "layout/StepperLayout";
import AdminLayout from "layout/AdminLayout";
import ProtectedRoute from './views/ProtectedPage';


const App = () => {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <Routes>
            {/* 레이아웃이 필요없는 페이지들 */}
            <Route path="/naver-callback" element={<Pages.NaverCallbackPage />} />
            <Route path="/" element={<Pages.LoginPage />} />
            <Route path="/oauth" element={<Pages.OAuthCallbackPage />} />
            <Route path="/signup" element={<Pages.SignupPage />} />
            <Route path="/findId" element={<Pages.FindIdPage />} />
            <Route path="/findPassword" element={<Pages.FindPasswordPage />} />

            {/* 관리자 페이지 라우트 */}
            <Route path="/admin" element={<AdminPages.AdminLoginPage />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminPages.DashboardPage />} />
              <Route path="/admin/users" element={<AdminPages.UsersPage />} />
              <Route path="/admin/projects" element={<AdminPages.ProjectsPage />} />
            </Route>

            {/* Stepper Page Layout */}
            <Route element={<StepperLayout />}>
              <Route path="/loading" element={<ProtectedRoute><Pages.LoadingPage /></ProtectedRoute>} />
              <Route path="/init" element={<ProtectedRoute><Pages.InitPage /></ProtectedRoute>} />
              <Route path="/step/:type" element={<ProtectedRoute><Pages.StepperPage /></ProtectedRoute>} />
              <Route path="/result" element={<ProtectedRoute><Pages.ResultPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Pages.ProfilePage /></ProtectedRoute>} />
              <Route path="/profileDetail/:id" element={<ProtectedRoute><Pages.ProfileDetailPage /></ProtectedRoute>} />
              <Route path="/subscription" element={<ProtectedRoute><Pages.SubscriptionPage /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Pages.PaymentPage /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><Pages.SuccessPage /></ProtectedRoute>} />
              <Route path="/fail" element={<ProtectedRoute><Pages.FailPage /></ProtectedRoute>} />
              <Route path="/status" element={<ProtectedRoute><Pages.StatusPage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  );
};
export default App;
