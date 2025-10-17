import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import * as Contacts from 'expo-contacts';


/**
 * Custom screen to fetch, display, and allow selection of device contacts.
 * NOTE: Ensure you have installed 'react-native-contacts' and configured 
 * native permissions in AndroidManifest.xml and Info.plist.
 */
const ContactsPickerScreen = ({ onContactsAdded }) => {
  // We use standard JS objects/arrays, no explicit type annotation needed
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Utility Functions ---

  /**
   * Requests runtime permission for contacts on Android.
   * On iOS, it relies on the Info.plist configuration.
   */
  const requestContactPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'Your safety app needs access to your contacts to select safety contacts.',
            buttonPositive: 'Allow',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    // Assume true for iOS (permission dialog handled by system on first access)
    return true;
  };

  /**
   * Loads all contacts from the device after obtaining permission.
   */
  const loadContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === 'granted') {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      const normalizedContacts = data
        .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
        .map(c => ({
          id: c.id,
          name: c.name || 'No Name',
          number: c.phoneNumbers[0].number.replace(/[\s-()]/g, ''),
          isSelected: false,
        }));

      setAllContacts(normalizedContacts);
      setFilteredContacts(normalizedContacts);
    } else {
      Alert.alert('No contacts found.');
    }
  } else {
    Alert.alert('Permission denied', 'Please enable contact access in settings.');
  }
};


  useEffect(() => {
    loadContacts();
  }, []);

  // --- Handlers ---

  /**
   * Handles search input to filter the displayed contacts.
   */
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = allContacts.filter(contact =>
        // Search by name (case-insensitive) or phone number
        contact.name.toLowerCase().includes(text.toLowerCase()) ||
        contact.number.includes(text.replace(/[\s-()]/g, '')),
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(allContacts);
    }
  };

  /**
   * Toggles the selection status of a contact.
   */
  const handleSelectContact = (id) => {
    // Toggle the selection state in the master list (allContacts)
    const updatedContacts = allContacts.map(contact =>
      contact.id === id ? { ...contact, isSelected: !contact.isSelected } : contact,
    );
    setAllContacts(updatedContacts);
    
    // Refresh the filtered list to reflect the new selection status in the UI
    handleSearch(searchQuery); 
  };

  /**
   * Saves the selected contacts and passes them to the parent component.
   */
  const handleSave = () => {
    const selected = allContacts.filter(c => c.isSelected);
    if (selected.length > 0) {
      // Pass the selected contacts back to your main safety app component
      onContactsAdded(selected);
      // Optional: Give feedback to the user
      Alert.alert('Success', `${selected.length} contacts added to your safety list.`);
    } else {
      Alert.alert('No Contacts Selected', 'Please select at least one contact to add.');
    }
  };

  // --- Renderer ---
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleSelectContact(item.id)}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactNumber}>{item.number}</Text>
      </View>
      <View style={[styles.checkbox, item.isSelected && styles.checkboxSelected]}>
        {item.isSelected && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );

  // --- Component JSX ---
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search contacts..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        initialNumToRender={20}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {allContacts.length === 0 
              ? 'Loading contacts or permission denied.' 
              : 'No contacts match your search.'
            }
          </Text>
        )}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          Add {allContacts.filter(c => c.isSelected).length} Safety Contact(s)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkMark: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  }
});

export default ContactsPickerScreen;