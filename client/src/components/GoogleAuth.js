import React from "react";
import Button from "../styles/Auth";
import { SignInIcon } from "./Icons";
import { authenticate } from "../utils/api-client";
import { GoogleLogin } from "@react-oauth/google";

function GoogleAuth() {
  return (
    <GoogleLogin
      onSuccess={authenticate}
      onError={authenticate}
      size="large"
      text="signin_with"
    />
    // <GoogleLogin
    //   clientId="your-client-id"
    //   cookiePolicy="single_host_origin"
    //   onSuccess={authenticate}
    //   onFailure={authenticate}
    //   render={(renderProps) => (
    //     <Button
    //       tabIndex={0}
    //       type="button"
    //       onClick={renderProps.onClick}
    //       disabled={renderProps.disabled}
    //     >
    //       <span className="outer">
    //         <span className="inner">
    //           <SignInIcon />
    //         </span>
    //         sign in
    //       </span>
    //     </Button>
    //   )}
    // />
  );
}

export default GoogleAuth;
