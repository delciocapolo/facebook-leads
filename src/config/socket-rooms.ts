export namespace NamespaceSocketRooms {
   export type Welcome = {}
}

export const socketRooms = {
   DEFAULT: {
      join: {
         DEFAULT: "join.emit_join"
      }
   },
   schema: {
      join: {
         DEFAULT: "schema.join",
      },
      emit: {
         all: "schema.emit_all",
         loadDataMessages: "schema.emit_load_data_messages",
      },
      on: {
         loadDataMessages: "schema.on_load_data_messages",
      },
      rooms: {
         schema: "schema",
         historyConversations: "history_data_conversations",
      }
   },
   qrCode: {
      join: {
         DEFAULT: "qrcode.join",
         alert: "qrcode.alert",
      },
      emit: {
         generate: "qrcode.emit_create_session",
         delete: "qrcode.emit_delete",
         requestChange: "qrcode.emit_request_change",
         alerts: "qrcode.emit_alert",
      },
      on: {
         channel: "qrcode.on_inject"
      },
      rooms: {
         DEFAULT: "qrcode.reader",
      }
   },
   messages: {
      emit: {
         send: "messages.emit_send",
         loadMessages: "messages.emit_load",
         loadMessagesByPhone: "messages.emit_load_by_phone",
         listenMessagesByPhone: "messages.emit_listen_by_phone",
         loadAllMessagesByTicket: "messages.emit_load_by_ticket",
         loadAllMessagesHistory: "messages.emit_load_history",
      },
      on: {
         loadMessagesByPhone: "messages.on_load_by_phone",
         loadAllMessagesHistory: "messages.on_load_history",
      }
   },
   phone: {
      emit: {
         delete: "phone.emit_delete",
         create: "phone.emit_create",
         find: "phone.emit_find",
         updateStatus: "phone.emit_update_status",
         checkQueue: "phone.check_queue"
      }
   }
};
