import { Container, Paper } from "@mui/material";
import React from "react";

// function Signup() {
//   return (
//     <form>
//       <label>
//         Enter your name:
//         <input type="text" />
//         <div> Signup</div>
//       </label>
//     </form>
//   );
// }

// export default Signup;

//Create Sign up Page using material UI
const Signup = () => {
  return (
    <Container maxWidth="xs">
      <Paper elevation={10}>Signup Page</Paper>
    </Container>
  );
};

export default Signup;
