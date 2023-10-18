import { Button, TextInput } from "@ignite-ui/react";
import { Form } from "./styles";
import { ArrowRight } from "phosphor-react";

function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput
        size="sm"
        prefix="ignite.com/"
        placeholder="seu-usuario"
        crossOrigin=""
      />
      <Button
        size="sm"
        type="submit"
      >
        Reservar usuário
        <ArrowRight />
      </Button>
    </Form>
  );
}

export default ClaimUsernameForm;
