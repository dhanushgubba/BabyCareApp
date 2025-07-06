import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { 
  AlertTriangle, 
  Bell, 
  Syringe, 
  Stethoscope, 
  X, 
  CheckCircle,
  Clock
} from 'lucide-react-native';

interface AlertCardProps {
  alert: {
    id: string;
    type: 'vaccination' | 'checkup' | 'milestone' | 'nutrition' | 'emergency';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    dueDate: Date;
    isRead: boolean;
    actionRequired: boolean;
    relatedMilestoneId?: string;
  };
  onDismiss: (alertId: string) => void;
  onMarkAsRead: (alertId: string) => void;
}

const alertIcons = {
  vaccination: Syringe,
  checkup: Stethoscope,
  milestone: Bell,
  nutrition: Bell,
  emergency: AlertTriangle,
};

const priorityColors = {
  low: '#64748B',
  medium: '#F59E0B',
  high: '#EF4444',
  critical: '#DC2626',
};

const alertTypeColors = {
  vaccination: '#6366F1',
  checkup: '#8B5CF6',
  milestone: '#10B981',
  nutrition: '#F59E0B',
  emergency: '#EF4444',
};

export function AlertCard({ alert, onDismiss, onMarkAsRead }: AlertCardProps) {
  const AlertIcon = alertIcons[alert.type];
  const priorityColor = priorityColors[alert.priority];
  const typeColor = alertTypeColors[alert.type];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) === 1 ? '' : 's'} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) === 1 ? '' : 's'} ago`;
  };

  const handleDismiss = () => {
    onDismiss(alert.id);
  };

  const handleMarkAsRead = () => {
    if (!alert.isRead) {
      onMarkAsRead(alert.id);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        !alert.isRead && styles.unreadContainer,
        alert.priority === 'critical' && styles.criticalContainer
      ]}
      onPress={handleMarkAsRead}
    >
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, { backgroundColor: typeColor + '20' }]}>
            <AlertIcon size={16} color={typeColor} />
          </View>
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.title,
                !alert.isRead && styles.unreadTitle
              ]}>
                {alert.title}
              </Text>
              {!alert.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: priorityColor }]} />
              )}
            </View>
            <Text style={styles.message}>{alert.message}</Text>
            
            <View style={styles.metaInfo}>
              <View style={styles.timeInfo}>
                <Clock size={12} color="#9CA3AF" />
                <Text style={styles.timeText}>
                  Due {formatTimeAgo(alert.dueDate)}
                </Text>
              </View>
              
              <View style={styles.badges}>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
                  <Text style={[styles.priorityText, { color: priorityColor }]}>
                    {alert.priority.toUpperCase()}
                  </Text>
                </View>
                
                {alert.actionRequired && (
                  <View style={styles.actionBadge}>
                    <Text style={styles.actionText}>ACTION REQUIRED</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={handleDismiss}
        >
          <X size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {alert.actionRequired && (
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton}>
            <CheckCircle size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Take Action</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadContainer: {
    backgroundColor: '#FEFEFE',
    borderLeftColor: '#6366F1',
  },
  criticalContainer: {
    backgroundColor: '#FEF2F2',
    borderLeftColor: '#DC2626',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E293B',
    flex: 1,
  },
  unreadTitle: {
    color: '#1E293B',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
  },
  actionBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dismissButton: {
    padding: 4,
  },
  actionSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButton: {
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
