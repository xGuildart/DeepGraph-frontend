import Realm from "realm";

const Genz = {
    name: "Genz",
    properties: {
        _id: "int",
        date: "date",
        category: "string",
        sentence: "string",
        sentence_short: "string",
        sentence_keywords: "string",
        sentence_sentiment: "string",
        sentence_sentiment_net: "float",
        sentence_sent_score: "float",
        sentence_sentiment_label: "int",
        sentence_entities: "string",
        sentence_non_entities: "string",
    },
};

const realm = await Realm.open({
    schema: [Genz],
});

export default realm;