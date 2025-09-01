'use client'

import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
} from 'react-native'

type LoadingModalProps = {
  open: boolean
}

export default function LoadingModal({ open }: LoadingModalProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!open) return
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "" : prev + "."))
    }, 500) // 0.5초마다
    return () => clearInterval(interval)
  }, [open])

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Image
            source={require('../../assets/etc/exitchar.svg')}
            style={styles.loadingImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Feedback is being generated</Text>
          <Text style={styles.subtitle}>
            Please wait a moment{dots}
          </Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  loadingImage: {
    width: 118,
    height: 94,
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
