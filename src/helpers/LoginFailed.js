import { withRouter } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { connect } from "react-redux";

function LoginFailed({ messege }) {
  return (
    <div style={{ "marginBottom": "-24px", "margintop": "-6px" }}>
      <Alert variant="danger">
        <Alert.Heading>You got an error!</Alert.Heading>
        <p>{messege}</p>
      </Alert>
    </div>
  );
}
export default withRouter(connect(null, null)(LoginFailed));