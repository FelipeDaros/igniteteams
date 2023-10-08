import { Header } from "@components/Header";
import { Container } from "./styles";
import { HighLight } from "@components/Highlight";
import { GroupCard } from "@components/GroupCard";
import { useCallback, useState } from "react";
import { Alert, FlatList } from "react-native";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { groupsGetAll } from "@storage/group/groupsGetAll";

export function Groups() {
  const navigation = useNavigation();
  const [groups, setGroups] = useState<string[]>([]);

  function handleNewGroup() {
    navigation.navigate('new');
  }

  async function fetchGroups() {
    try {
      const data = await groupsGetAll();

      setGroups(data);
    } catch (error) {
      Alert.alert('Turmas', 'Não foi possível carregar as turmas');
      console.log(error);
    }
  }

  function handleOpenGrouop(group: string) {
    navigation.navigate('players', { group });
  }

  useFocusEffect(
    useCallback(() => {
      fetchGroups()
    }, []))

  return (
    <Container>
      <Header />
      <HighLight
        title="Turmas"
        subTitle="jogue com a sua turma"
      />

      <FlatList
        data={groups}
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => <GroupCard onPress={() => handleOpenGrouop(item)} title={item} />}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={<ListEmpty message="Que tal cadastrar a primeira turma ?" />}
      />
      
      <Button onPress={handleNewGroup} title="Criar nova turma" />
    </Container>
  );
}