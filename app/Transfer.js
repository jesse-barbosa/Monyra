import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../apiConfig';
import styles from '../styles/global';

const TransferScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, operation } = route.params;
  const [userGoals, setUserGoals] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [category, setCategoryValue] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (userGoals.length > 0) {
      setCategoryValue(userGoals[0].category);
    }
  }, [userGoals]);

  const fetchUserGoals = (userCod) => {
    axios.post(`${API_URL}`, {
      action: 'getUserGoals',
      userCod
    })
    .then(response => {
      const { success, message, goals } = response.data;
      if (success) {
        setUserGoals(goals);
      } else {
        setError(message);
      }
    })
    .catch(error => {
      console.error('Error fetching user goals:', error);
      setError('An error occurred while fetching user goals.');
    });
  };

  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setInputValue(inputValue.slice(0, -1));
    } else {
      setInputValue(inputValue + key);
    }
  };

  const handlePress = () => {
    if (inputValue && category) {
      axios.post(`${API_URL}`, {
        action: 'transfer',
        value: inputValue,
        operation,
        category,
        description
      })
      .then(response => {
        const { success, message, user } = response.data;
        if (success) {
          if (user && user.nameUser) {
            navigation.navigate('Home', { userData });
          } else {
            Alert.alert('Transfer Failed', 'User data is not available.');
          }
        } else {
          Alert.alert('Transfer Failed', message);
        }
      })
      .catch(error => {
        console.error('Error transferring in:', error);
        Alert.alert('Transfer Error', 'An error occurred while transferring in.');
      });
    } else {
      Alert.alert('Campos vazios!', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View style={{...styles.container, paddingTop: 40,}}>
      <ScrollView style={styles.scrollview}>
            <View style={styles.title}>
              <Text style={styles.valueTransfer}>R$ {inputValue}</Text>
            </View>
          <View style={styles.inputs}>
            <View style={styles.inputContainer}>
                {operation === 'expense' ? (
                <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue) => setCategoryValue(itemValue)}
                >
                <Picker.Item label="Selecione uma categoria" value="" />
                  <Picker.Item label="Moradia" value="Moradia" />
                  <Picker.Item label="Alimentação" value="Alimentação" />
                  <Picker.Item label="Transporte" value="Transporte" />
                  <Picker.Item label="Saúde" value="Saúde" />
                  <Picker.Item label="Educação" value="Educação" />
                  <Picker.Item label="Lazer" value="Lazer" />
                  <Picker.Item label="Vestuário" value="Vestuário" />
                  <Picker.Item label="Economia ou Investimentos" value="Economia" />
                </Picker>
              ) : (
                <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue) => setCategoryValue(itemValue)}
                >
                <Picker.Item label="Selecione uma categoria" value="" />
                  <Picker.Item label="Salário ou Remunerações" value="Remunerações" />
                  <Picker.Item label="Investimentos (rendimentos)" value="Rendimentos" />
                  <Picker.Item label="Empreendimentos" value="Empreendimentos" />
                  <Picker.Item label="Benefícios" value="Benefícios" />
              </Picker>
              )}
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                maxLength={30}
                style={styles.input}
                placeholder="Descrição (opcional)"
                onChangeText={setDescription}
                value={description}
              />
            </View>
          </View>
            <View style={styles.keyboard}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((item, index) => (
                <TouchableOpacity key={index} style={styles.key} onPress={() => handleKeyPress(item)}>
                  <Text style={styles.keyText}>{item}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('⌫')}>
                <Image source={require('../assets/img/icons/close-circle.png')} style={styles.keyText}/>
              </TouchableOpacity>
            </View>

      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
    </View>
  );
};

export default TransferScreen;