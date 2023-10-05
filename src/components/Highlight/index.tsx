import { Container, SubTitle, Title } from "./stlyes";

type Props = {
  title: string;
  subTitle: string;
}

export function HighLight({ subTitle, title }: Props) {
  return (
    <Container>
      <Title>{title}</Title>
      <SubTitle>{subTitle}</SubTitle>
    </Container>
  );
}