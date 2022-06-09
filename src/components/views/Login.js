import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Form from "../../utilities/Forms";
import logo from '../../logo.png';
import { checkUser } from "../../utilities/restapiconsumer";

const Login = (props) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [validate, setValidate] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateLogin = () => {
    let isValid = true;

    let validator = Form.validator({
      identifier: {
        value: identifier,
        isRequired: true,
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


  const authenticate = (e) => {
    e.preventDefault();

    const validate = validateLogin();

    if (validate) {
      checkUser(identifier, password).then((response) => {
        console.log(response)
        if ((response.status === 202) && (response.data === true)) {
          setValidate({});
          setIdentifier("");
          setPassword("");
          props.history.push('/view');
        }
      }
      )

    }
  };

  const togglePassword = (e) => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  return (
    <div className="row g-0 auth-wrapper">
      <div className="App text-center">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Visualizer3D</h2>
        </div>
        <p className="App-intro">
          View DataSet on graphs
        </p>
      </div>
      {/* <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
        <div className="auth-background-holder"></div>
        <div className="auth-background-mask"></div>
      </div> */}

      <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center">
        <div className="d-flex flex-column align-content-end">
          <div className="auth-body mx-auto">
            <div className="auth-form-container text-start">
              <form
                className="auth-form"
                method="POST"
                onSubmit={authenticate}
                autoComplete={"off"}
              >
                <div className="identifier mb-3">
                  <input
                    type="identifier"
                    className={`form-control ${validate.validate && validate.validate.identifier
                      ? "is-invalid "
                      : ""
                      }`}
                    id="identifier"
                    name="indetifier"
                    value={identifier}
                    placeholder="Identifier"
                    onChange={(e) => setIdentifier(e.target.value)}
                  />

                  <div
                    className={`invalid-feedback text-start ${validate.validate && validate.validate.identifier
                      ? "d-block"
                      : "d-none"
                      }`}
                  >
                    {validate.validate && validate.validate.identifier
                      ? validate.validate.identifier[0]
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

                  <div className="extra mt-3 row justify-content-between">
                    <div className="col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="remember"
                          checked={remember}
                          onChange={(e) => setRemember(e.currentTarget.checked)}
                        />
                        <label className="form-check-label" htmlFor="remember">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="forgot-password text-end">
                        <Link to="/forgot-password">Forgot password?</Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 theme-btn mx-auto"
                  >
                    Log In
                  </button>
                </div>
              </form>

              <hr />
              <div className="auth-option text-center pt-2">
                No Account?{" "}
                <Link className="text-link" to="/register">
                  Sign up{" "}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
