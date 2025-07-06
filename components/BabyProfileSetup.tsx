import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Baby, 
  Calendar, 
  MapPin, 
  User, 
  Weight, 
  X,
  Check,
  ChevronDown
} from 'lucide-react-native';
import { BabyProfile } from '../types/journey';
import { indianStates } from '../data/indianHealthcareData';

interface BabyProfileSetupProps {
  visible: boolean;
  onClose: () => void;
  onSave: (profile: BabyProfile) => void;
  initialProfile?: BabyProfile;
}

export function BabyProfileSetup({ visible, onClose, onSave, initialProfile }: BabyProfileSetupProps) {
  const [profile, setProfile] = useState<Partial<BabyProfile>>(
    initialProfile || {
      name: '',
      birthDate: new Date(),
      gender: 'other',
      state: 'Maharashtra',
      isPregnancy: false,
    }
  );

  const [showStatePicker, setShowStatePicker] = useState(false);
  const [step, setStep] = useState(1);

  const handleSave = () => {
    if (profile.name && profile.birthDate && profile.gender && profile.state) {
      const completeProfile: BabyProfile = {
        id: initialProfile?.id || Date.now().toString(),
        name: profile.name,
        birthDate: profile.birthDate,
        gender: profile.gender as 'male' | 'female' | 'other',
        state: profile.state,
        birthWeight: profile.birthWeight,
        isPregnancy: profile.isPregnancy || false,
        dueDate: profile.dueDate,
        currentWeek: profile.currentWeek,
      };
      onSave(completeProfile);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateCurrentWeek = () => {
    if (profile.isPregnancy && profile.dueDate) {
      const now = new Date();
      const pregnancyStart = new Date(profile.dueDate.getTime() - 280 * 24 * 60 * 60 * 1000); // 40 weeks before due date
      const weeksPassed = Math.floor((now.getTime() - pregnancyStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return Math.max(1, Math.min(42, weeksPassed));
    } else if (profile.birthDate) {
      const now = new Date();
      const weeksSinceBirth = Math.floor((now.getTime() - profile.birthDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return Math.max(0, weeksSinceBirth);
    }
    return 0;
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Baby's Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter baby's name"
          value={profile.name || ''}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderOptions}>
          {[
            { key: 'male', label: '👶 Boy', icon: '♂️' },
            { key: 'female', label: '👧 Girl', icon: '♀️' },
            { key: 'other', label: '👶 Prefer not to say', icon: '○' }
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.genderOption,
                profile.gender === option.key && styles.genderOptionActive
              ]}
              onPress={() => setProfile({ ...profile, gender: option.key as any })}
            >
              <Text style={styles.genderIcon}>{option.icon}</Text>
              <Text style={[
                styles.genderLabel,
                profile.gender === option.key && styles.genderLabelActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Tracking Type</Text>
        <View style={styles.trackingOptions}>
          <TouchableOpacity
            style={[
              styles.trackingOption,
              !profile.isPregnancy && styles.trackingOptionActive
            ]}
            onPress={() => setProfile({ ...profile, isPregnancy: false })}
          >
            <Baby size={20} color={!profile.isPregnancy ? '#6366F1' : '#9CA3AF'} />
            <Text style={[
              styles.trackingLabel,
              !profile.isPregnancy && styles.trackingLabelActive
            ]}>
              Baby Born
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.trackingOption,
              profile.isPregnancy && styles.trackingOptionActive
            ]}
            onPress={() => setProfile({ ...profile, isPregnancy: true })}
          >
            <User size={20} color={profile.isPregnancy ? '#6366F1' : '#9CA3AF'} />
            <Text style={[
              styles.trackingLabel,
              profile.isPregnancy && styles.trackingLabelActive
            ]}>
              Pregnancy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        {profile.isPregnancy ? 'Pregnancy Details' : 'Birth Details'}
      </Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          {profile.isPregnancy ? 'Expected Due Date' : 'Birth Date'}
        </Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => {
            // For now, just set a default date - in a real app you'd use DateTimePicker
            const today = new Date();
            if (profile.isPregnancy) {
              setProfile({ ...profile, dueDate: today });
            } else {
              setProfile({ ...profile, birthDate: today });
            }
          }}
        >
          <Calendar size={20} color="#6366F1" />
          <Text style={styles.dateText}>
            {profile.isPregnancy 
              ? (profile.dueDate ? formatDate(profile.dueDate) : 'Select due date')
              : (profile.birthDate ? formatDate(profile.birthDate) : 'Select birth date')
            }
          </Text>
        </TouchableOpacity>
      </View>

      {!profile.isPregnancy && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Birth Weight (optional)</Text>
          <View style={styles.weightInput}>
            <Weight size={20} color="#6366F1" />
            <TextInput
              style={styles.weightTextInput}
              placeholder="2500"
              value={profile.birthWeight?.toString() || ''}
              onChangeText={(text) => setProfile({ ...profile, birthWeight: parseInt(text) || undefined })}
              keyboardType="numeric"
            />
            <Text style={styles.weightUnit}>grams</Text>
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your State</Text>
        <TouchableOpacity
          style={styles.stateInput}
          onPress={() => setShowStatePicker(true)}
        >
          <MapPin size={20} color="#6366F1" />
          <Text style={styles.stateText}>
            {profile.state || 'Select your state'}
          </Text>
          <ChevronDown size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {profile.isPregnancy && (
        <View style={styles.pregnancyInfo}>
          <Text style={styles.pregnancyInfoTitle}>Current Week</Text>
          <Text style={styles.pregnancyInfoWeek}>
            Week {calculateCurrentWeek()} of pregnancy
          </Text>
        </View>
      )}
    </View>
  );

  const renderStatePicker = () => (
    <Modal visible={showStatePicker} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.pickerModal}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Your State</Text>
            <TouchableOpacity onPress={() => setShowStatePicker(false)}>
              <X size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerList}>
            {indianStates.map((state) => (
              <TouchableOpacity
                key={state}
                style={[
                  styles.pickerItem,
                  profile.state === state && styles.pickerItemActive
                ]}
                onPress={() => {
                  setProfile({ ...profile, state });
                  setShowStatePicker(false);
                }}
              >
                <Text style={[
                  styles.pickerItemText,
                  profile.state === state && styles.pickerItemTextActive
                ]}>
                  {state}
                </Text>
                {profile.state === state && (
                  <Check size={20} color="#6366F1" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#F8FAFC', '#EEF2FF']}
          style={styles.background}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {initialProfile ? 'Edit Profile' : 'Setup Baby Profile'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.progressIndicator}>
            <View style={[styles.progressStep, step >= 1 && styles.progressStepActive]} />
            <View style={[styles.progressStep, step >= 2 && styles.progressStepActive]} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {step === 1 ? renderStep1() : renderStep2()}
          </ScrollView>

          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep(step - 1)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[
                styles.nextButton,
                (!profile.name || !profile.gender) && styles.nextButtonDisabled
              ]}
              onPress={() => {
                if (step === 1) {
                  setStep(2);
                } else {
                  handleSave();
                }
              }}
              disabled={step === 1 && (!profile.name || !profile.gender)}
            >
              <Text style={styles.nextButtonText}>
                {step === 1 ? 'Next' : 'Save Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          {renderStatePicker()}
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  progressIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#6366F1',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  genderOptions: {
    gap: 12,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  genderOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  genderIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  genderLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  genderLabelActive: {
    color: '#6366F1',
  },
  trackingOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  trackingOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  trackingOptionActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  trackingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  trackingLabelActive: {
    color: '#6366F1',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    flex: 1,
  },
  weightInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  weightTextInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  weightUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  stateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  stateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
    flex: 1,
  },
  pregnancyInfo: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  pregnancyInfoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
  },
  pregnancyInfoWeek: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#6366F1',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
  },
  pickerList: {
    flex: 1,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  pickerItemActive: {
    backgroundColor: '#EEF2FF',
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  pickerItemTextActive: {
    color: '#6366F1',
    fontFamily: 'Inter-SemiBold',
  },
});
