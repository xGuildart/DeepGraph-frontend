import { useContext, useState, forwardRef } from "react";
import { Link } from "react-router-dom";
import { Context, withContext } from "../../store/Store";
import Form from "../../utilities/Forms";
import { registerUser } from "../../utilities/restapiconsumer";
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validate, setValidate] = useState({});
  const [isRegistred, setIsRegistred] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useContext(Context);

  const validateRegister = () => {
    let isValid = true;

    let validator = Form.validator({
      name: {
        value: name,
        isRequired: true,
      },
      email: {
        value: email,
        isRequired: true,
        isEmail: true,
      },
      password: {
        value: password,
        isRequired: true,
        minLength: 6,
      },
    });

    if (validator !== null) {
      setValidate({
        validate: validator.errors,
      });

      isValid = false;
    }
    return isValid;
  };

  const register = (e) => {
    e.preventDefault();

    console.log(name);

    //getToken();
    const validate = validateRegister();

    if (validate) {
      registerUser(name, email, password).then((response) => {
        if (response.status == 201) {
          setValidate({});
          setName("");
          setEmail("");
          setPassword("");
          setRegistered(true);
        } else if (response.status == 226) {
          dispatch({ type: 'setAlreadyRegistred', payload: true });
          setIsRegistred(true);
        }
      }, (error) => console.log(error));


    }
  };

  const togglePassword = (e) => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsRegistred(false);
    setRegistered(false);
    dispatch({ type: 'setAlreadyRegistred', payload: false });
  };

  return (
    <div className="row g-0 auth-wrapper">
      <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
        <div className="auth-background-holder"></div>
        <div className="auth-background-mask"></div>
      </div>

      <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
        <div className="d-flex flex-column align-content-end">
          <div className="auth-body mx-auto">
            <p>Create your Account</p>
            <div className="auth-form-container text-start">
              <form
                className="auth-form"
                method="POST"
                onSubmit={register}
                autoComplete={"off"}
              >
                <div className="name mb-3">
                  <input
                    type="text"
                    className={`form-control ${validate.validate && validate.validate.name
                      ? "is-invalid "
                      : ""
                      }`}
                    id="name"
                    name="name"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                  />

                  <div
                    className={`invalid-feedback text-start ${validate.validate && validate.validate.name
                      ? "d-block"
                      : "d-none"
                      }`}
                  >
                    {validate.validate && validate.validate.name
                      ? validate.validate.name[0]
                      : ""}
                  </div>
                </div>

                <div className="email mb-3">
                  <input
                    type="email"
                    className={`form-control ${validate.validate && validate.validate.email
                      ? "is-invalid "
                      : ""
                      }`}
                    id="email"
                    name="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <div
                    className={`invalid-feedback text-start ${validate.validate && validate.validate.email
                      ? "d-block"
                      : "d-none"
                      }`}
                  >
                    {validate.validate && validate.validate.email
                      ? validate.validate.email[0]
                      : ""}
                  </div>
                </div>

                <div className="password mb-3">
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${validate.validate && validate.validate.password
                        ? "is-invalid "
                        : ""
                        }`}
                      name="password"
                      id="password"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={(e) => togglePassword(e)}
                    >
                      <i
                        className={
                          showPassword ? "far fa-eye" : "far fa-eye-slash"
                        }
                      ></i>{" "}
                    </button>

                    <div
                      className={`invalid-feedback text-start ${validate.validate && validate.validate.password
                        ? "d-block"
                        : "d-none"
                        }`}
                    >
                      {validate.validate && validate.validate.password
                        ? validate.validate.password[0]
                        : ""}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 theme-btn mx-auto"
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <hr />
              <div className="auth-option text-center pt-2">
                Have an account?{" "}
                <Link className="text-link" to="/login">
                  Sign in
                </Link>
                <Snackbar open={isRegistred} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                    This username or email are already used, please change them!
                  </Alert>
                </Snackbar>
                <Snackbar open={registered} autoHideDuration={4000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    You are successfully registered
                  </Alert>
                </Snackbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withContext(Register);
