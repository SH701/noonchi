import { useAuth } from "@/lib/UserContext";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type PersonaSlide =
  | { isAdd: true }
  | {
      isAdd?: false;
      personaId: number | string;
      name: string;
      profileImageUrl?: string;
    };

type Props = {
  onAdd?: () => void;
  onItemClick?: (idx: number, it: PersonaSlide) => void;
  onLoad?: (reload: () => void) => void;
  itemSize?: number;
  gap?: number;
  visibleCount?: number;
  viewportWidth?: number;
};

export default function PersonaSlider({
  onAdd,
  onItemClick,
  onLoad,
  itemSize = 56,
  gap = 12,
  visibleCount = 5,
  viewportWidth,
}: Props) {
  const { accessToken } = useAuth();
  const [items, setItems] = useState<PersonaSlide[]>([]);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  const fetchPersonas = async () => {
    if (!accessToken) return;
    try {
      const API_BASE = "https://noonchi.ai.kr";
      const res = await fetch(`${API_BASE}/api/personas/my?page=1&size=10`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      const personas = Array.isArray(data) ? data : data?.content || [];

      const mapped: PersonaSlide[] = personas.map((p: any) => ({
        personaId: p.personaId || p.id,
        name: p.name,
        profileImageUrl: p.profileImageUrl || p.imageUrl,
      }));

      setItems([{ isAdd: true }, ...mapped]);
    } catch (err) {
      console.error("Persona fetch error", err);
    }
  };

  // 2. effect 안에서 호출
  useEffect(() => {
    fetchPersonas();
    onLoad?.(fetchPersonas);
  }, [accessToken]);

  const viewW = viewportWidth ?? SCREEN_WIDTH;
  const trackWidth = useMemo(
    () =>
      items?.length ? items.length * itemSize + (items.length - 1) * gap : 0,
    [items, itemSize, gap]
  );

  if (!items || items.length === 0) {
    return (
      <View style={[styles.container, { width: viewW }]}>
        <TouchableOpacity
          onPress={onAdd}
          style={[styles.addButton, { width: itemSize, height: itemSize }]}
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
          { width: trackWidth, columnGap: gap },
        ]}
      >
        {items.map((it, i) =>
          "isAdd" in it && it.isAdd ? (
            <View key={`add-${i}`} style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={onAdd}
                style={[
                  styles.addButton,
                  { width: itemSize, height: itemSize },
                ]}
              >
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
              <Text style={[styles.nameText, { maxWidth: itemSize }]}>Add</Text>
            </View>
          ) : (
            <View
              key={`${it.personaId}-${i}`}
              style={[styles.itemContainer, { width: itemSize }]}
            >
              {it.profileImageUrl ? (
                <TouchableOpacity onPress={() => onItemClick?.(i, it)}>
                  <Image
                    source={{ uri: it.profileImageUrl }}
                    style={[
                      styles.profileImage,
                      { width: itemSize, height: itemSize },
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.placeholderImage,
                    { width: itemSize, height: itemSize },
                  ]}
                >
                  <Text style={styles.placeholderText}>
                    {it.name?.charAt(0) ?? "?"}
                  </Text>
                </View>
              )}
              <Text
                style={[styles.nameText, { maxWidth: itemSize }]}
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
  container: { overflow: "hidden" },
  scrollContent: { flexDirection: "row", alignItems: "center" },
  addButton: {
    borderRadius: 9999,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "white", fontSize: 24, fontWeight: "bold" },
  itemContainer: { alignItems: "center" },
  profileImage: { borderRadius: 34, backgroundColor: "#e5e7eb" },
  placeholderImage: {
    borderRadius: 9999,
    backgroundColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { fontSize: 14, color: "#6b7280" },
  nameText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
    color: "#374151",
  },
});
