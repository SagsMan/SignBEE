import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Message, useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ConversationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    conversations,
    messages,
    user,
    markConversationRead,
    sendMessage,
    startIncomingCall,
  } = useApp();
  const conversation = conversations.find(item => item.id === id);
  const conversationMessages = useMemo(
    () =>
      messages
        .filter(message => message.conversationId === id)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    [messages, id],
  );
  const [text, setText] = useState("");
  const [attachmentUri, setAttachmentUri] = useState<string>();
  const [sending, setSending] = useState(false);
  const topPad = Platform.OS === "web" ? 20 : insets.top;

  useEffect(() => {
    if (id) void markConversationRead(id);
  }, [id]);

  if (!conversation) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.notFoundTitle, { color: colors.navyDark }]}>Conversation not found</Text>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>
          This conversation is no longer available on this device.
        </Text>
      </View>
    );
  }

  const avatarSource =
    conversation.participantAvatar === "male"
      ? require("@/assets/images/interpreter_male.png")
      : require("@/assets/images/interpreter_female.png");

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setAttachmentUri(result.assets[0]?.uri);
    }
  };

  const submitMessage = async () => {
    if (!id || sending) return;
    if (!text.trim() && !attachmentUri) {
      Alert.alert("Empty message", "Write a message or attach an image before sending.");
      return;
    }
    setSending(true);
    try {
      await sendMessage(
        id,
        attachmentUri ? "image" : "text",
        text,
        attachmentUri,
      );
      setText("");
      setAttachmentUri(undefined);
    } catch (error) {
      Alert.alert(
        "Message not sent",
        error instanceof Error ? error.message : "Try again in a moment.",
      );
    } finally {
      setSending(false);
    }
  };

  const openCall = async (type: "audio" | "video") => {
    await startIncomingCall({
      type,
      callerId: conversation.participantId,
      callerName: conversation.participantName,
      callerAvatar: conversation.participantAvatar,
    });
    router.push("/incoming-call");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 4 : 0}
    >
      <View style={[styles.header, { paddingTop: topPad + 4, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Image source={avatarSource} style={styles.headerAvatar} />
        <View style={styles.headerCopy}>
          <Text style={[styles.headerName, { color: colors.navyDark }]}>
            {conversation.participantName}
          </Text>
          <Text style={[styles.headerStatus, { color: colors.success }]}>
            {conversation.participantRole}
          </Text>
        </View>
        <TouchableOpacity onPress={() => void openCall("audio")} style={styles.iconButton}>
          <Feather name="phone" size={19} color={colors.navyDark} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => void openCall("video")} style={styles.iconButton}>
          <Feather name="video" size={20} color={colors.navyDark} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversationMessages}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.messageList,
          { paddingBottom: 12 },
          conversationMessages.length === 0 && styles.emptyList,
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            colors={colors}
            currentUserId={user?.id || "current-user"}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyConversation}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.greenLight }]}>
              <Feather name="message-circle" size={24} color={colors.navyDark} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.navyDark }]}>
              Start a conversation
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Send a message to {conversation.participantName}.
            </Text>
          </View>
        }
      />

      {attachmentUri ? (
        <View style={[styles.attachmentPreview, { backgroundColor: colors.muted }]}>
          <Image source={{ uri: attachmentUri }} style={styles.previewImage} />
          <Text style={[styles.previewText, { color: colors.foreground }]}>Ready to send</Text>
          <TouchableOpacity onPress={() => setAttachmentUri(undefined)} style={styles.removeButton}>
            <Feather name="x" size={16} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      ) : null}

      <View
        style={[
          styles.composer,
          {
            paddingBottom: Platform.OS === "web" ? 12 : insets.bottom + 8,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <TouchableOpacity onPress={() => void chooseImage()} style={styles.attachButton} disabled={sending}>
          <Feather name="paperclip" size={20} color={colors.navyDark} />
        </TouchableOpacity>
        <TextInput
          style={[styles.textInput, { borderColor: colors.border, color: colors.foreground }]}
          value={text}
          onChangeText={setText}
          placeholder="Write a message..."
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={1000}
          editable={!sending}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: text.trim() || attachmentUri ? colors.primary : colors.muted },
          ]}
          onPress={() => void submitMessage()}
          disabled={sending}
        >
          <Feather
            name="send"
            size={18}
            color={text.trim() || attachmentUri ? colors.navyDark : colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBubble({
  message,
  colors,
  currentUserId,
}: {
  message: Message;
  colors: ReturnType<typeof useColors>;
  currentUserId: string;
}) {
  const isSent =
    message.senderId === currentUserId || message.senderId === "current-user";
  return (
    <View style={[styles.messageItem, isSent ? styles.sentItem : styles.receivedItem]}>
      <View
        style={[
          styles.bubble,
          isSent
            ? { backgroundColor: colors.navyDark, borderBottomRightRadius: 4 }
            : { backgroundColor: colors.muted, borderBottomLeftRadius: 4 },
        ]}
      >
        {message.type === "image" && message.attachmentUri ? (
          <Image source={{ uri: message.attachmentUri }} style={styles.messageImage} />
        ) : null}
        {message.content ? (
          <Text style={[styles.messageText, { color: isSent ? "#FFFFFF" : colors.foreground }]}>
            {message.content}
          </Text>
        ) : null}
        <View style={styles.messageMeta}>
          <Text style={[styles.messageTime, { color: isSent ? "#FFFFFF99" : colors.mutedForeground }]}>
            {formatTime(message.timestamp)}
          </Text>
          {isSent ? (
            <Feather
              name={message.status === "read" ? "check-circle" : "check"}
              size={12}
              color={message.status === "read" ? colors.primary : "#FFFFFF99"}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, paddingHorizontal: 20 },
  notFoundTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 26 },
  notFoundText: { fontSize: 13, lineHeight: 19, marginTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  iconButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerCopy: { flex: 1 },
  headerName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  headerStatus: { fontSize: 10, marginTop: 3 },
  messageList: { paddingHorizontal: 16, paddingTop: 18 },
  emptyList: { flex: 1 },
  messageItem: { flexDirection: "row", marginBottom: 11 },
  sentItem: { justifyContent: "flex-end" },
  receivedItem: { justifyContent: "flex-start" },
  bubble: { maxWidth: "82%", minWidth: 68, borderRadius: 16, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 7 },
  messageText: { fontSize: 13, lineHeight: 19 },
  messageImage: { width: 190, height: 145, borderRadius: 10, marginBottom: 4 },
  messageMeta: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 5 },
  messageTime: { fontSize: 9 },
  emptyConversation: { alignItems: "center", justifyContent: "center", paddingTop: 90 },
  emptyIcon: { width: 55, height: 55, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 12, marginTop: 5 },
  attachmentPreview: { minHeight: 58, marginHorizontal: 12, marginBottom: 6, borderRadius: 12, padding: 7, flexDirection: "row", alignItems: "center", gap: 9 },
  previewImage: { width: 44, height: 44, borderRadius: 7 },
  previewText: { flex: 1, fontSize: 12, fontFamily: "Inter_500Medium" },
  removeButton: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  composer: { borderTopWidth: 1, paddingHorizontal: 10, paddingTop: 9, flexDirection: "row", alignItems: "flex-end", gap: 7 },
  attachButton: { width: 38, height: 44, alignItems: "center", justifyContent: "center" },
  textInput: { flex: 1, minHeight: 44, maxHeight: 100, borderWidth: 1, borderRadius: 22, paddingHorizontal: 15, paddingVertical: 11, fontSize: 13 },
  sendButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});