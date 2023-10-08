import { Alert, FlatList, TextInput } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from '@react-navigation/native';
import { AppError } from "@utils/AppError";

import { Header } from "@components/Header";
import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { HighLight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";


import { playerAddByGroup } from "@storage/playe/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/playe/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/playe/PlayerStorageDTO";
import { playerRemoveByGroup } from "@storage/playe/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";

type RouteParams = {
  group: string;
}


export function Players() {
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');

  const navigation = useNavigation();
  const route = useRoute();

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const { group } = route.params as RouteParams

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);

      fetchPlayersByTeam();

    } catch (error) {
      console.log(error);

      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
    }
  }

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.');
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();

      setNewPlayerName("");
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message);
      } else {
        console.log(error);
        Alert.alert('Nova pessoa', 'Não foi possível adicionar.')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate('groups');

    } catch (error) {
      console.log(error);
      Alert.alert('Remover Grupo', 'Não foi posível remover o grupo');
    }
  }

  async function handleGroupRemove() {
    Alert.alert(
      'Remover',
      'Deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() }
      ]
    )
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />
      <HighLight title={group} subTitle="Adicione a galera e separe os times" />
      <Form>
        <Input returnKeyLabel="done" onSubmitEditing={handleAddPlayer} inputRef={newPlayerNameInputRef} value={newPlayerName} onChangeText={setNewPlayerName} placeholder="Nome da pessoa" autoCorrect={false} />
        <ButtonIcon onPress={handleAddPlayer} icon="add" />
      </Form>
      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter title={item} isActive={item === team} onPress={() => setTeam(item)} />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>
      <FlatList
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard name={item.name} onRemove={() => handlePlayerRemove(item.name)} />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
      />
      <Button
        title="Remover Turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  )
}