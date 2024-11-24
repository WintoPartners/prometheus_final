import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './views/ProtectedPage/AuthContext'; // AuthProvider를 임포트
import * as Pages from "./views";
import StepperLayout from "layout/StepperLayout";
import ProtectedRoute from './views/ProtectedPage';


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Stepper Page Layout */}
          <Route element={<StepperLayout />}>
            <Route path="/loading" element={<ProtectedRoute><Pages.LoadingPage /></ProtectedRoute>} />
            <Route path="/init" element={<Pages.InitPage />}/>
            <Route path="/step/:type" element={<ProtectedRoute><Pages.StepperPage /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Pages.ResultPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Pages.ProfilePage /></ProtectedRoute>} />
            <Route path="/profileDetail/:id" element={<ProtectedRoute><Pages.ProfileDetailPage /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Pages.SubscriptionPage /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><Pages.PaymentPage /></ProtectedRoute>} />
            <Route path="/success" element={<ProtectedRoute><Pages.SuccessPage /></ProtectedRoute>} />
            <Route path="/fail" element={<ProtectedRoute><Pages.FailPage /></ProtectedRoute>} />
            <Route path="/status" element={<ProtectedRoute><Pages.StatusPage /></ProtectedRoute>} />
            <Route path="/" element={<Pages.LoginPage />} />
            <Route path="/oauth" element={<Pages.OAuthCallbackPage />} />
            <Route path="/noauth" element={<Pages.NaverCallbackPage />} />
            <Route path="/signup" element={<Pages.SignupPage />} />
            <Route path="/findId" element={<Pages.FindIdPage />} />
            <Route path="/findPassword" element={<Pages.FindPasswordPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};
export default App;
