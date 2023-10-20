import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import {
  AuthError,
  ConnectBox,
  ConnectItem,
  Container,
  Header,
} from "./styles";
import { ArrowRight, Check } from "phosphor-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function ConnectCalendar() {
  const session = useSession();
  const router = useRouter();

  const hasAuthScopeError = !!router.query.error;
  const isSignedIn = session.status === "authenticated";

  async function handleSignIn() {
    await signIn("google", { callbackUrl: "/register/connect-calendar" });
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep
          size={4}
          currentStep={2}
        />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Agenda</Text>

          {isSignedIn ? (
            <Button
              disabled
              size="sm"
            >
              Conectado <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignIn}
            >
              Conectar <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthScopeError && (
          <AuthError size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar.
          </AuthError>
        )}

        <Button
          type="submit"
          disabled={!isSignedIn}
        >
          Próximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}

export default ConnectCalendar;
