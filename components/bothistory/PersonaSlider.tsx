/* eslint-disable @typescript-eslint/no-explicit-any */
// components/bothistory/PersonaSlider.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

export type PersonaSlide =
  | { isAdd: true }
  | {
      isAdd?: false;
      personaId: number | string;
      name: string;
      profileImageUrl?: string;
    };

type Props = {
  onAdd?: () => void; // '+' 클릭
  onItemClick?: (idx: number, it: PersonaSlide) => void; // 아이템 클릭(모달 오픈용)
  itemSize?: number;
  gap?: number;
  visibleCount?: number;
  viewportWidth?: number;
  className?: string;
};

const normalizeSrc = (src?: string) =>
  !src ? "" : src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;

export default function PersonaSlider({
  onAdd,
  onItemClick,
  itemSize = 56,
  gap = 12,
  visibleCount = 5,
  viewportWidth,
  className,
}: Props) {
  const [items, setItems] = useState<PersonaSlide[]>([]);

  // ✅ API 호출
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch("/api/personas/my?page=1&size=10", {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") ?? ""
            }`,
          },
        });
        const data = await res.json();

        // data가 배열이면 직접 사용, 아니면 data.content 사용
        const personas = Array.isArray(data) ? data : data?.content || [];

        const mapped: PersonaSlide[] = personas.map((p: any) => ({
          personaId: p.personaId || p.id,
          name: p.name,
          profileImageUrl: p.profileImageUrl || p.imageUrl,
        }));

        // 마지막에 '+' 버튼 추가
        setItems([{ isAdd: true }, ...mapped]);
      } catch (err) {
        console.error("Persona fetch error", err);
      }
    };

    fetchPersonas();
  }, []);

  const viewW =
    viewportWidth ?? visibleCount * itemSize + (visibleCount - 1) * gap;
  const trackWidth = useMemo(
    () =>
      items?.length ? items.length * itemSize + (items.length - 1) * gap : 0,
    [items, itemSize, gap]
  );

  if (!items || items.length === 0) {
    // 로딩 또는 데이터 없음 → '+'만
    return (
      <View style={[styles.container, { width: viewW }]}>
        <TouchableOpacity
          onPress={onAdd}
          style={[
            styles.addButton,
            { width: itemSize, height: itemSize }
          ]}
          accessibilityLabel="Add persona"
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: viewW }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { width: trackWidth, columnGap: gap }
        ]}
      >
        {items.map((it, i) =>
          "isAdd" in it && it.isAdd ? (
            <TouchableOpacity
              key={`add-${i}`}
              onPress={onAdd}
              style={[
                styles.addButton,
                { width: itemSize, height: itemSize }
              ]}
              accessibilityLabel="Add persona"
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          ) : (
            <View
              key={`${it.personaId}-${i}`}
              style={[styles.itemContainer, { width: itemSize }]}
            >
              {it.profileImageUrl ? (
                <TouchableOpacity
                  onPress={() => onItemClick?.(i, it)}
                  style={styles.imageContainer}
                >
                  <Image
                    source={{ uri: normalizeSrc(it.profileImageUrl) }}
                    style={[
                      styles.profileImage,
                      { width: itemSize, height: itemSize }
                    ]}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.placeholderImage,
                    { width: itemSize, height: itemSize }
                  ]}
                >
                  <Text style={styles.placeholderText}>
                    {it.name?.charAt(0) ?? "?"}
                  </Text>
                </View>
              )}

              {/* ✅ 이미지 밑에 이름 표시 */}
              <Text
                style={[
                  styles.nameText,
                  { maxWidth: itemSize }
                ]}
                numberOfLines={1}
              >
                {it.name}
              </Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 34,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  profileImage: {
    borderRadius: 34,
  },
  placeholderImage: {
    borderRadius: 34,
    backgroundColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6b7280',
  },
  nameText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    color: '#374151',
  },
});
