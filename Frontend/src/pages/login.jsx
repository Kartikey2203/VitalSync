import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function Login() {

  const handleSuccess = async (credentialResponse) => {
    console.log(credentialResponse);

    const res = await axios.post(
      'http://localhost:5000/api/auth/google',
      {
        token: credentialResponse.credential
      }
    );

    console.log(res.data);
  };

  return (
    <div>
      <h1>VitalSync Login</h1>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}

export default Login;