import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EmailVerify() {
  const [validUrl, setValidUrl] = useState();
  const param = useParams();
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `/api/auth/${param.id}/verify/${param.token}`;
        await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, []);

  return (
    <div>

      {validUrl ? (
        <div>
          <h1>Email verified successfully</h1>
          <Link to="/auth">
            <button>Login Here!</button>
          </Link>
        </div>
      ) : (
        <div>
          <h1>Error 404 User not found! </h1>
          <Link to="/register">
            <button>Return to register</button>
          </Link>
        </div>
      )}
    </div>

  );
}

export default EmailVerify;
