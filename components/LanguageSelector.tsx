import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Globe, Check } from 'lucide-react-native';
import { useLanguage, Language } from '@/hooks/useLanguage';

export function LanguageSelector() {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const [showModal, setShowModal] = useState(false);

  const languages = Object.entries(availableLanguages).map(([code, name]) => ({
    code: code as Language,
    name,
  }));

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setShowModal(true)}
      >
        <Globe size={16} color="#6366F1" />
        <Text style={styles.selectorText}>
          {availableLanguages[currentLanguage]}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageItem}
                  onPress={() => handleLanguageSelect(item.code)}
                >
                  <Text style={styles.languageName}>{item.name}</Text>
                  {currentLanguage === item.code && (
                    <Check size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  selectorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  closeButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});