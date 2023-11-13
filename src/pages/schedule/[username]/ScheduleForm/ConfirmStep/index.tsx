import React from "react";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";
import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { CalendarBlank, Clock, TextIndent } from "phosphor-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

const confirmFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome precisa ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Digite um e-mail válido." }),
  observations: z.string().nullable(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  handleClearSelectedDateTime: () => void;
}

function ConfirmStep({
  schedulingDate,
  handleClearSelectedDateTime,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmFormSchema),
  });

  const router = useRouter();
  const username = String(router.query.username);

  async function handleConfirmScheduling(data: ConfirmFormData) {
    const { name, email, observations } = data;

    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      observations,
      date: schedulingDate,
    });

    handleClearSelectedDateTime();
  }

  const fullDate = dayjs(schedulingDate).format("DD[ de ]MMMM[ de ]YYYY");
  const fullTime = dayjs(schedulingDate).format("HH:mm[h]");

  return (
    <ConfirmForm
      as="form"
      onSubmit={handleSubmit(handleConfirmScheduling)}
    >
      <FormHeader>
        <Text>
          <CalendarBlank /> {fullDate}
        </Text>
        <Text>
          <Clock /> {fullTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput
          crossOrigin=""
          placeholder="Seu nome"
          {...register("name")}
        />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput
          crossOrigin=""
          placeholder="seuemail@exemplo.com"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register("observations")} />
      </label>

      <FormActions>
        <Button
          type="button"
          variant="tertiary"
          onClick={handleClearSelectedDateTime}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}

export default ConfirmStep;
