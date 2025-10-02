import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Dimensions,
} from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MockDataService, { UserProfile } from '../data/MockDataService';

const { width } = Dimensions.get('window');

export const SettingsScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [notifications, setNotifications] = useState({
    energyAlerts: true,
    deviceStatus: true,
    communityUpdates: false,
    aiRecommendations: true,
  });
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false,
  });
  const mockService = MockDataService.getInstance();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await mockService.getUserProfile();
      setUserProfile(profile);
      setEditForm(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const success = await mockService.updateUserProfile(editForm);
      if (success) {
        setUserProfile({ ...userProfile, ...editForm } as UserProfile);
        setIsEditing(false);
        Alert.alert('성공', '프로필이 업데이트되었습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '로그아웃', style: 'destructive', onPress: () => {
          // 실제 앱에서는 로그아웃 로직 구현
          Alert.alert('로그아웃', '로그아웃되었습니다.');
        }}
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 정말 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => {
          Alert.alert('계정 삭제', '계정이 삭제되었습니다.');
        }}
      ]
    );
  };

  const handleDemoReset = () => {
    Alert.alert(
      '데모 리셋',
      '모든 데이터를 초기 상태로 리셋하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '리셋', onPress: () => {
          // MockDataService 리셋
          Alert.alert('데모 리셋', '데모 데이터가 초기화되었습니다.');
        }}
      ]
    );
  };

  if (isLoading || !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>설정을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
        <Text style={styles.headerSubtitle}>계정 및 앱 설정을 관리하세요</Text>
      </View>

      {/* 사용자 프로필 */}
      <Animatable.View animation="fadeInDown" duration={800}>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Icon name="person" size={40} color="white" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userProfile.name}</Text>
                <Text style={styles.profileEmail}>{userProfile.email}</Text>
                <Text style={styles.profileType}>{userProfile.householdType}</Text>
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                <Icon name={isEditing ? "close" : "edit"} size={20} color="#667eea" />
              </TouchableOpacity>
            </View>

            {isEditing && (
              <Animatable.View animation="fadeInUp" duration={300}>
                <View style={styles.editForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>이름</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.name || ''}
                      onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                      placeholder="이름을 입력하세요"
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>이메일</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.email || ''}
                      onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                      placeholder="이메일을 입력하세요"
                      keyboardType="email-address"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>주소</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.address || ''}
                      onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                      placeholder="주소를 입력하세요"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>거주자 수</Text>
                    <TextInput
                      style={styles.input}
                      value={editForm.residentCount?.toString() || ''}
                      onChangeText={(text) => setEditForm({ ...editForm, residentCount: parseInt(text) || 0 })}
                      placeholder="거주자 수를 입력하세요"
                      keyboardType="numeric"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                  >
                    <Text style={styles.saveButtonText}>저장</Text>
                  </TouchableOpacity>
                </View>
              </Animatable.View>
            )}
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 알림 설정 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={200}>
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title>알림 설정</Title>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="flash-on" size={24} color="#FF9800" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>에너지 알림</Text>
                  <Text style={styles.settingDescription}>전력 사용량 급증 시 알림</Text>
                </View>
              </View>
              <Switch
                value={notifications.energyAlerts}
                onValueChange={(value) => setNotifications({ ...notifications, energyAlerts: value })}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={notifications.energyAlerts ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="device-hub" size={24} color="#2196F3" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>디바이스 상태</Text>
                  <Text style={styles.settingDescription}>디바이스 연결 상태 변경 알림</Text>
                </View>
              </View>
              <Switch
                value={notifications.deviceStatus}
                onValueChange={(value) => setNotifications({ ...notifications, deviceStatus: value })}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={notifications.deviceStatus ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="group" size={24} color="#9C27B0" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>커뮤니티 업데이트</Text>
                  <Text style={styles.settingDescription}>랭킹 및 챌린지 업데이트</Text>
                </View>
              </View>
              <Switch
                value={notifications.communityUpdates}
                onValueChange={(value) => setNotifications({ ...notifications, communityUpdates: value })}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={notifications.communityUpdates ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="psychology" size={24} color="#4CAF50" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>AI 추천</Text>
                  <Text style={styles.settingDescription}>AI 최적화 제안 알림</Text>
                </View>
              </View>
              <Switch
                value={notifications.aiRecommendations}
                onValueChange={(value) => setNotifications({ ...notifications, aiRecommendations: value })}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={notifications.aiRecommendations ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 개인정보 보호 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={400}>
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title>개인정보 보호</Title>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="share" size={24} color="#FF5722" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>데이터 공유</Text>
                  <Text style={styles.settingDescription}>익명화된 데이터 연구용 공유</Text>
                </View>
              </View>
              <Switch
                value={privacy.dataSharing}
                onValueChange={(value) => setPrivacy({ ...privacy, dataSharing: value })}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={privacy.dataSharing ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="analytics" size={24} color="#607D8B" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>사용 분석</Text>
                  <Text style={styles.settingDescription}>앱 사용 패턴 분석</Text>
                </View>
              </View>
              <Switch
                value={privacy.analytics}
                onValueChange={(value) => setPrivacy({ ...privacy, analytics: value })}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={privacy.analytics ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="campaign" size={24} color="#E91E63" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>마케팅</Text>
                  <Text style={styles.settingDescription}>관련 제품 및 서비스 안내</Text>
                </View>
              </View>
              <Switch
                value={privacy.marketing}
                onValueChange={(value) => setPrivacy({ ...privacy, marketing: value })}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor={privacy.marketing ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 앱 정보 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={600}>
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title>앱 정보</Title>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>버전</Text>
              <Text style={styles.infoValue}>1.0.0 (데모)</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>빌드</Text>
              <Text style={styles.infoValue}>2024.01.15</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>개발사</Text>
              <Text style={styles.infoValue}>HEMS Team</Text>
            </View>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 데모 전용 설정 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={800}>
        <Card style={[styles.settingsCard, { backgroundColor: '#FFF3E0' }]}>
          <Card.Content>
            <Title style={{ color: '#F57C00' }}>데모 전용 설정</Title>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoReset}
            >
              <Icon name="refresh" size={20} color="#F57C00" />
              <Text style={styles.demoButtonText}>데모 데이터 리셋</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 계정 관리 */}
      <Animatable.View animation="fadeInUp" duration={800} delay={1000}>
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title>계정 관리</Title>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLogout}
            >
              <Icon name="logout" size={20} color="#F44336" />
              <Text style={[styles.actionButtonText, { color: '#F44336' }]}>로그아웃</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeleteAccount}
            >
              <Icon name="delete-forever" size={20} color="#F44336" />
              <Text style={[styles.actionButtonText, { color: '#F44336' }]}>계정 삭제</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </Animatable.View>

      {/* 하단 여백 */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileCard: {
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileType: {
    fontSize: 12,
    color: '#999',
    textTransform: 'capitalize',
  },
  editButton: {
    padding: 8,
  },
  editForm: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    marginTop: 8,
  },
  demoButtonText: {
    color: '#F57C00',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
