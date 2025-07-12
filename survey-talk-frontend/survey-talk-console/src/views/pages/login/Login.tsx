import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/root-reducer'
import { clearAuthToken, setAuthToken } from '../../../redux/auth/auth.slice'
import { JwtUtil } from '../../../core/utils/jwt.util'
import { publicAxiosInstance } from '../../../core/api/rest-api/config/instances/v2'
import { login } from '../../../core/services/auth/auth.service'
import { toast } from 'react-toastify'

const Login = () => {

  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authSlice = useSelector((state: RootState) => state.auth);


  const [validated, setValidated] = useState<boolean>(false)

  const [disabled, setDisabled] = useState(false);
  const handleLogout = () => {
    dispatch(clearAuthToken());
  }
  useEffect(() => {
    handleLogout()
  }, [])



  useEffect(() => {
    if (authSlice && authSlice.token != null && JwtUtil.isTokenNotExpired(authSlice.token)) {
      // alert("You are already logged in");
      const user = JwtUtil.decodeToken(authSlice.token)
      if (user.role_id == 1) {
        navigate('/dashboard');
      } else if (user.role_id == 2) {
        navigate('/community-survey');
      }
    }
  }, [authSlice])



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setValidated(true)
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault();
      setDisabled(true);
      if (email.current?.value == "" || password.current?.value == "") {
        setDisabled(false);
        return;
      }
      const login_information = {
        email: email.current?.value,
        password: password.current?.value
      }

      let response = await login(publicAxiosInstance, login_information);

      if (response.success && response.data) {
        const user = JwtUtil.decodeToken(response.data.AccessToken);
        dispatch(setAuthToken({
          token: response.data.AccessToken,
          user: user
        }));
        if (user.role_id == 1) {
          navigate('/dashboard');
          toast.success("Login successful!");
        } else if (user.role_id == 2) {
          navigate('/community-survey');
          toast.success("Login successful!");
        }
      } else {
        console.log(response.message);
        toast.error(response.message.content || "Login failed. Please try again.");
      }
      setDisabled(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                  >
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput ref={email} placeholder="Email" autoComplete="email" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput ref={password}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type='submit' disabled={disabled} >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
