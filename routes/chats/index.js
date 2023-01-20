class AMessageStore {
  saveMessage(message) {}
  findMessagesForChat(id) {}
}

class MessageStore extends AMessageStore {
  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message) {
    this.messages.push(message);
  }

  findMessagesForChat(id) {
    const messages = this.messages.filter(
      ({ from, to }) => to === id
    ); 
    return messages
  }
}

module.exports = {
  MessageStore
};