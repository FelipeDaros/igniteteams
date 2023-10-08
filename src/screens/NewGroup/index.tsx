import { Header } from "@components/Header";
import { Container, Content, Icon } from "./styles";
import { HighLight } from "@components/Highlight";
import { Button } from "@components/Button";
import { Input } from "@components/Input";

import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";



export function NewGroup() {
  const navigation = useNavigation();
  const [group, setGroup] = useState("");

  async function handleNew() {
    try {
      if(group.trim().length === 0){
        return Alert.alert("Novo grupo", "Informe o nome do Turma");
      }

      await groupCreate(group);

      navigation.navigate('players', { group });
    } catch (error) {
      if(error instanceof AppError){
        Alert.alert("Novo grupo", error.message);
      }else{
        Alert.alert("Novo grupo", "Não foi possível criar um novo grupo.");
        console.log(error);
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />
      <Content>
        <Icon />
        <HighLight title="Nova turma" subTitle="Crie a turma para adicionar as pessoas" />
        <Input onChangeText={setGroup} placeholder="Nome da turma" />
        <Button onPress={handleNew} title="Criar" style={{ marginTop: 20 }} />
      </Content>
    </Container>
  )
}