// 🦕 AUTOGENERATED! DO NOT EDIT! File to edit: core/messaging.ipynb

import type { Database } from "tinychat/db.ts";
import { Record as Message } from "tinychat/api/types/chat/tinychat/core/message.ts";
import { ChannelView } from "tinychat/api/types/chat/tinychat/server/defs.ts";
import { ServerView } from "tinychat/api/types/chat/tinychat/server/defs.ts";

const get_time_us = (): string => `${new Date().getTime() * 1000}`;

const cleanupChannelView = (view: ChannelView) => {
  return Object.fromEntries(Object.entries(view).filter(([, v]) => v !== null));
};

export class Messaging {
  constructor(protected db: Database) {}

  public markAllMessagesAsRead(
    { channel, server, user }: {
      channel: string;
      server: string;
      user: string;
    },
  ) {
    this.db
      .prepare(
        `INSERT OR REPLACE INTO read_receipts (channel, server, user, time_us) VALUES (:channel, :server, :user, :time)`,
      )
      .run({ channel, user, server, time: get_time_us() });
  }

  public getServers(
    { uris, did, viewer }: {
      uris?: string[] | undefined;
      did?: string | undefined;
      viewer?: string | undefined;
    },
  ): ServerView[] {
    const sql = (where: string = "") => {
      const w = [viewer ? `c.user = '${viewer}'` : "", where].filter((q) => q)
        .join(" AND ").trim();
      const s = !viewer
        ? `SELECT 
        s.uri,
        s.name,
        s.creator,
        json_group_array(
          json_object(
            'id', c.id,
            'name', c.name,
            'server', c.server,
            'latestMessageReceivedTime', c.latest_message_received_time_us
          )
        ) as channels
        FROM servers s
        INNER JOIN channels c ON c.server = s.uri
        ${w ? `WHERE ${w}` : ""}
        GROUP BY s.uri`
        : `SELECT 
        s.uri,
        s.name,
        s.creator,
        json_group_array(
          json_object(
            'id', c.id,
            'name', c.name,
            'server', c.server,
            'lastMessageReadTime', c.last_message_read_time_us,
            'latestMessageReceivedTime', c.latest_message_received_time_us
          )
        ) as channels
        FROM servers s
        INNER JOIN channel_view c ON c.server = s.uri
        ${w ? `WHERE ${w}` : ""}
        GROUP BY s.uri`;
      return this.db.prepare(s);
    };

    let results: ServerView[] = [];
    if (uris && uris.length > 0) {
      results = sql(`s.uri IN (${uris.map((u) => `'${u}'`).join(", ")})`).all<
        ServerView
      >();
    } else if (did) {
      results = sql(`s.creator = :did`).all<ServerView>({
        did,
      });
    } else {
      results = sql().all<ServerView>();
    }

    return results.map((rec) =>
      Object.assign(rec, {
        channels: (rec.channels || []).map(cleanupChannelView),
      })
    );
  }

  public receiveMessage(
    { m, uri, sender, time_us }: {
      m: Message;
      uri: string;
      sender: string;
      time_us: string;
    },
  ) {
    this.db.prepare(`
      INSERT INTO messages (uri, channel, server, text, sender, created_at, time_us) VALUES (
        :uri, :channel, :server, :text, :sender, :created_at, :time_us
      )`).run({
      uri,
      channel: m.channel,
      server: m.server,
      text: m.text,
      sender,
      created_at: m.createdAt,
      time_us: time_us,
    });
  }
}
import { getDatabase } from "tinychat/db.ts";
import { TID } from "@atproto/common";

class TestMessaging extends Messaging {
  constructor() {
    super(getDatabase({ reset: true }));
  }

  public static server: string = "at://server-1";
  public static user1: string = "did:1";
  public static user2: string = "did:2";
  public static channel1: string = TID.nextStr();
  public static channel2: string = TID.nextStr();

  public user1MessagesChannel1(text: string) {
    this.receiveMessage({
      m: {
        channel: TestMessaging.channel1,
        server: "at://server-1",
        text,
        createdAt: new Date().toISOString(),
      },
      uri: "at://message-1",
      sender: TestMessaging.user1,
      time_us: get_time_us(),
    });
  }

  public static setup(): TestMessaging {
    const service = new TestMessaging();
    // insert 2 test users
    [1, 2].forEach((i) => {
      service.db
        .prepare(
          `
        INSERT INTO users (did, handle, display_name, avatar, description) VALUES (
          :did, :handle, :display_name, :avatar, :description
        )
      `,
        )
        .run({
          did: `did:${i}`,
          handle: `user-${i}`,
          display_name: `User ${i}`,
          avatar: `http://google.com/avatar-${i}.jpeg`,
          description: `description ${i}`,
        });
    });
    // create test server
    service.db
      .prepare(
        `
      INSERT INTO servers (uri, name, creator) VALUES (
        :uri, :name, :creator
      )
    `,
      )
      .run({
        uri: "at://server-1",
        name: "Test Server",
        creator: "did:1",
      });

    // create memberships for both users
    [1, 2].forEach((i) => {
      service.db
        .prepare(
          `
        INSERT INTO server_memberships (user, server) VALUES (
          :user, :server
        )
      `,
        )
        .run({
          user: `did:${i}`,
          server: "at://server-1",
        });
    });

    // setup channels
    [TestMessaging.channel1, TestMessaging.channel2].forEach((c) => {
      service.db
        .prepare(
          `
        INSERT INTO channels (id, name, server) VALUES (
          :id, :name, :server
        )
      `,
        )
        .run({
          id: c,
          name: `channel ${c}`,
          server: "at://server-1",
        });
    });

    // set up another chat server
    service.db
      .prepare(
        `
      INSERT INTO servers (uri, name, creator) VALUES (
        :uri, :name, :creator
      )
    `,
      )
      .run({
        uri: "at://server-2",
        name: "Test Server 2",
        creator: "did:1",
      });

    // create memberships for both users
    [1, 2].forEach((i) => {
      service.db
        .prepare(
          `
        INSERT INTO server_memberships (user, server) VALUES (
          :user, :server
        )
      `,
        )
        .run({
          user: `did:${i}`,
          server: "at://server-2",
        });
    });

    // setup channels
    [1, 2].forEach((i) => {
      service.db
        .prepare(
          `
        INSERT INTO channels (id, name, server) VALUES (
          :id, :name, :server
        )
      `,
        )
        .run({
          id: TID.nextStr(),
          name: `channel server 2 ${i}`,
          server: "at://server-2",
        });
    });

    return service;
  }
}

const messagingSeed =
  `**Bom dia!** Fancy a bite of *Bacalhau à Brás* today? 🇵🇹 A classic Portuguese dish of shredded cod, onions, and fried potatoes—comfort food at its finest!
Want to explore **Portuguese pastries**? 🥐 Try the iconic *Pastéis de Nata*! Crispy, creamy, and best with a sprinkle of cinnamon.
**Curious about Portuguese wine?** 🍷 Check out the [Vinho Verde](https://en.wikipedia.org/wiki/Vinho_Verde)—a fresh, slightly effervescent wine perfect with seafood! 🐟
*Fun fact*: There are **365 ways** to prepare Bacalhau (salted cod) in Portugal—one for each day of the year! 🤩
Can’t visit Lisbon? Bring it home! Try making a **Piri-Piri Chicken** recipe tonight. Spicy and flavorful. 🌶️ 🍗
**Question of the day**: Do you prefer your *Bolinhos de Bacalhau* crispy or fluffy? 😋
If you love *sardines*, don’t miss the annual **Lisbon Sardine Festival** in June! 🐟🎉
*Feeling thirsty?* Why not make a refreshing **Sangria** with a Portuguese twist? Add Vinho Verde and citrus fruits! 🍊
**Quick tip:** Always pair your *Pastéis de Nata* with a shot of **Portuguese espresso**—small but mighty! ☕
**Resource spotlight:** Learn more about Portuguese cuisine with this guide: [Portuguese Food 101](https://www.theguardian.com/portuguese-cuisine-guide).
*Legend has it* that Portuguese sailors brought chili peppers to Europe—ever heard of their **Piri-Piri Sauce**? 🌶️🔥
Craving *comfort food*? Nothing beats a warm bowl of **Caldo Verde** with chorizo and cornbread! 🥖🍲
Did you know? *Portuguese olive oil* is some of the best in the world—perfect for dipping bread or drizzling over salads! 🫒
Why is *Bacalhau* salted? **Answer**: It’s a preservation method used by Portuguese fishermen centuries ago! 🐟⚓
**Need ideas for seafood?** Try making *Amêijoas à Bulhão Pato* (clams in garlic and wine sauce). Simple yet delicious! 🍋
Ever tried **Francesinha**? 🇵🇹 Think of it as a Portuguese sandwich stacked with meats, cheese, and a rich beer sauce. 🍺 🥪
*Portuguese food on a budget*: Pick up some **canned sardines**—a national treasure—and serve them with crusty bread. 🐟🍞
Did you know **Peri-Peri Chicken** is a blend of Portuguese and African flavors? A spicy global favorite! 🌍🔥
**Spotlight dish:** Polvo à Lagareiro (octopus with olive oil and garlic)—a favorite on Portugal’s coast! 🐙
Feeling bold? Try the traditional *Tripas à Moda do Porto*—a tripe stew from northern Portugal. Not for the faint-hearted! 🍲
If you could eat *only one Portuguese dish for life,* what would it be? 🤔 *My pick: Bacalhau à Brás!*
Want to bake something new? **Pão de Deus** ("Bread of God") is a sweet coconut-topped bread perfect for breakfast. 🥥🍞
**Pro tip:** Pair a glass of **Port wine** with a slice of dark chocolate—it’s divine! 🍷🍫
Love rice? Try *Arroz de Marisco* (Portuguese seafood rice)—rich, creamy, and packed with flavor. 🍤🍚
What’s your favorite **Portuguese spice**? Mine’s *piri-piri*—a little goes a long way! 🌶️
Discover the **Azorean specialty**: *Alcatra*—a slow-cooked beef stew served with fresh bread. 🍖
Bring Portugal home! Learn to make *Pão Alentejano*, the rustic bread from the Alentejo region. 🥖
**Snack spotlight**: Rissóis—crispy Portuguese empanadas filled with shrimp or beef. A must-try! 🦐🥟
Raise your hand 🙋 if you’re a fan of **Portuguese charcuterie**: chouriço, presunto, and more. 🐖🧀
*Did you know?* The Portuguese introduced tea culture to Britain! Sip some **Gorreana tea** from the Azores. 🍵
Ever heard of *Choco Frito*? It’s **fried cuttlefish**, a beloved dish in Setúbal. Think calamari but better! 🦑
Treat yourself to **Bolo de Arroz**—Portuguese rice flour muffins with a hint of lemon. 🍋
Time to bake? Try making a **Bola de Berlim**, Portugal’s version of a donut with custard filling! 🍩
Check out this Portuguese cookbook for ideas: [Lisbon to the Table](https://example.com)! 📚
*Dreaming of summer?* Nothing screams Portuguese summer like grilled **sardines** by the seaside! 🐟🌊
**Challenge**: Make an authentic *Feijoada* (bean stew) this weekend. Bonus points for pairing it with rice! 🍛
Feeling adventurous? *Caracois*—Portuguese-style snails—are a must-try for the curious foodie! 🐌
Toast to Portugal with a glass of **Porto Tonic**—white port, tonic water, and lime. Refreshing! 🍹
What’s your take on Portuguese desserts? *Arroz Doce* (sweet rice pudding) or *Toucinho do Céu* (almond cake)? 🍰
Want to impress? Serve **Lapas Grelhadas**—grilled limpets with garlic butter. Coastal Portugal in a bite! 🐚
🇵🇹 Explore the flavors of **Alentejo cuisine**: hearty pork dishes, stews, and bread-based recipes. 🍖🥖
Curious about *Azorean cuisine*? Try **Cozido das Furnas**, a geothermal-cooked stew unique to the islands. 🌋
Did you know? Portuguese *Espetada* (meat skewers) originated in Madeira. Perfect for grilling! 🍢
**Cheese lovers unite!** 🧀 Taste *Queijo da Ilha*, an Azorean cheese with bold flavor.
Discover **Portugal’s National Soup**: *Caldo Verde*—kale, potatoes, and chouriço. Healthy and heartwarming. 🥣
Want to level up? Pair grilled fish with *salada de pimentos assados* (roasted pepper salad). 🌶️
Learn the art of making *Ginjinha*! 🍒 A cherry liqueur that Lisbon locals love to sip.
Did someone say *desserts?* **Pão de Ló** is a fluffy Portuguese sponge cake—irresistible! 🍰
**Bom dia, food lovers!** 🌅 Start your day the Portuguese way with a bite of *Pastéis de Nata*—crispy puff pastry filled with creamy custard, topped with a dash of cinnamon or powdered sugar. Pair it with a bold Portuguese espresso for the ultimate breakfast experience! ☕ 🇵🇹
*Ever wondered what to do with salted cod?* 🐟 Try **Bacalhau à Brás**, a beloved dish made with shredded codfish, sautéed onions, crispy fried potatoes, and scrambled eggs. It’s comfort food with a touch of sophistication!
**Did you know?** The Portuguese brought spices like cinnamon, nutmeg, and chili to Europe during the Age of Exploration. These spices are now an integral part of Portuguese cuisine, elevating dishes like *Arroz Doce* (sweet rice pudding) to aromatic perfection. 🌍✨
Let’s talk about **Caldo Verde**, a simple yet soul-warming kale and potato soup. 🥬 Traditionally served with slices of chouriço (Portuguese sausage) and rustic cornbread, this dish is a staple at Portuguese family dinners and festas.
Craving seafood? 🦑 Dive into the flavors of *Polvo à Lagareiro*! This dish features roasted octopus drenched in olive oil and garlic, served with crispy potatoes. A coastal classic, it captures the essence of Portugal’s maritime heritage. 🌊
**Wine lovers, rejoice!** 🍷 Portugal’s **Vinho Verde** isn’t just a wine—it’s a celebration of freshness. Slightly sparkling, light, and citrusy, it pairs beautifully with grilled sardines, seafood, or even a sunny afternoon.
Feeling adventurous? 🐌 Try *Caracóis*! These tiny Portuguese-style snails are simmered in a flavorful broth of garlic, oregano, and white wine. They’re a summertime favorite served with crusty bread and cold beer.
Let’s celebrate *Lisbon’s culinary gem*, the **Francesinha**! 🥪 This hearty sandwich from Porto layers meats, cheese, and a fried egg, then smothers it all in a rich beer-based sauce. Pair with crispy fries for a true Portuguese indulgence!
*Did you know?* Portugal is home to **Port wine**, one of the world’s finest fortified wines. From ruby to tawny, each sip tells a story of the Douro Valley’s sun-kissed vineyards. Pair it with blue cheese or chocolate for an unforgettable tasting. 🏞️
Have you ever tried *Bola de Berlim*? 🍩 This Portuguese take on the donut is filled with rich custard cream instead of jam, making it the perfect snack for coffee breaks or lazy afternoons. *Pro tip*: Best enjoyed fresh from a pastelaria!
**Sweet or savory?** 🇵🇹 Portuguese food is all about balance. Enjoy a slice of *Bolo de Arroz* (rice cake) for breakfast, then savor *Arroz de Pato* (duck rice) for dinner—a baked rice dish bursting with the flavors of duck, chouriço, and citrus zest.
Want to spice up your cooking? 🌶️ Make your own *Piri-Piri Sauce*! Blend bird’s eye chilies, garlic, olive oil, and vinegar. Use it as a marinade for chicken, a condiment for seafood, or a dip for crusty bread. Your taste buds will thank you!
*Transport yourself to the Azores* with **Cozido das Furnas**! 🌋 This unique stew is slow-cooked underground using volcanic steam. Packed with meats, vegetables, and sausages, it’s a true taste of Portugal’s geothermal wonders.
Feeling festive? 🎉 Nothing beats the **Lisbon Sardine Festival**! Celebrate with grilled sardines, smoky *Salada de Pimentos Assados* (roasted peppers), and traditional music. *Can’t make it?* Host your own version at home with friends and family. 🐟
**Cheese lovers, take note!** 🧀 Portugal boasts some of the world’s finest artisanal cheeses. Try *Queijo da Serra da Estrela*, a creamy sheep’s cheese from the mountains, served with crusty bread and a drizzle of honey. 🐑🍯
Have you heard of *Tripas à Moda do Porto*? 🍲 This hearty tripe stew is a symbol of Porto’s resilience and culinary tradition. Made with beans, sausage, and slow-cooked meats, it’s a flavorful dish that warms the soul.
Feeling creative in the kitchen? 🥖 Bake *Pão Alentejano*, a traditional bread from the Alentejo region. Its rustic crust and soft interior make it perfect for dipping into olive oil or pairing with hearty soups. 🍲
**Did you know?** Portuguese egg-based desserts like *Toucinho do Céu* (Heaven’s Lard) were invented by nuns in monasteries. These sweet treats are rich with egg yolks, sugar, and almonds—a legacy of centuries-old culinary artistry. 🍮
*Grilled sardines are more than food—they’re culture!* 🐟 Seasoned simply with salt and grilled to perfection, they’re served with potatoes and roasted peppers. Pair with a glass of *Vinho Verde* for an authentic Portuguese experience.
Let’s talk about *Alheira*, Portugal’s **smoky garlic sausage**. Originally created by Jewish communities, it’s now a beloved dish enjoyed fried, grilled, or baked, often served with fried eggs and potatoes. 🍳
**Hosting a dinner?** Impress your guests with *Arroz de Tamboril*—a monkfish rice dish with tomatoes, garlic, and herbs. It’s like a Portuguese risotto, but with a seafood twist! 🍤
In the mood for something sweet? 🍫 Try *Salame de Chocolate*—a no-bake chocolate “salami” made with crushed biscuits, cocoa, and condensed milk. Slice it thin and serve with coffee for a decadent treat.
*Looking for street food?* 🌭 Grab a **Bifana**, Portugal’s iconic pork sandwich. Thinly sliced marinated pork is stuffed into a fresh roll and doused with mustard or hot sauce. Simple, satisfying, and so delicious!
**Discover Madeira!** 🏝️ This Portuguese island is famous for its unique cuisine. Try *Espetada Madeirense*, beef skewers marinated in garlic and bay leaf, cooked over an open flame. Pair with the island’s famous Madeira wine! 🍖
**Bom dia, foodies!** 🇵🇹 Today’s spotlight is on *Bacalhau à Brás*, one of Portugal’s most beloved dishes. It’s made with shredded salted cod, finely chopped onions, crispy matchstick potatoes, and eggs all mixed into a creamy, flavorful delight. Garnish with parsley and olives for that extra touch. Perfect for lunch or dinner! 🐟
**Sweet tooth alert!** 🍬 If you haven’t tried *Pastéis de Nata*, you’re missing out on a piece of heaven. These iconic custard tarts, with their flaky, buttery crust and creamy custard filling, are a must-try. Best served slightly warm with a dusting of cinnamon and powdered sugar. *Pro tip*: Pair with a strong shot of Portuguese espresso. ☕
**Portuguese wine education:** 🍷 Have you heard of *Vinho Verde*? This "green wine" isn't literally green but refers to its youthful freshness. It’s slightly fizzy, delightfully crisp, and pairs beautifully with seafood like grilled sardines or a platter of *Amêijoas à Bulhão Pato* (clams in garlic and white wine sauce). Cheers! 🥂
*Did you know?* Portugal consumes more codfish (or *bacalhau*) than any other country in the world, even though it doesn’t naturally occur in Portuguese waters. There are said to be **365 recipes** for cooking bacalhau, one for each day of the year. What’s your favorite cod dish? 🐟
**Feeling adventurous in the kitchen?** Try making *Francesinha* tonight! 🍔 This legendary sandwich from Porto is layered with cured meats, steak, and sausage, topped with melted cheese, and drenched in a spicy beer-based sauce. Don’t forget to serve it with fries for dipping. *Warning: It’s messy but oh-so-worth it!* 🍟
**Spotlight on Caldo Verde**: This simple yet heartwarming soup is a staple in Portuguese homes. It combines potatoes, onions, and garlic, blended into a creamy base, with ribbons of tender kale and slices of smoky chouriço sausage. Serve with cornbread (*broa*) for the ultimate comfort meal. Perfect for cold evenings! 🥖🥣
Thinking about desserts? 🍰 Don’t sleep on *Arroz Doce*! This creamy Portuguese rice pudding is made with Arborio rice, milk, sugar, and a touch of lemon zest, then finished with a sprinkle of cinnamon. It’s simple, comforting, and nostalgic. A perfect way to end any meal! 🌟
*Fun fact:* Portugal is one of the world’s top producers of **cork**—yes, as in wine bottle stoppers! 🍾 But did you know the cork oak forests (known as *montado*) also provide a habitat for wild boar and support local cuisines with dishes like *Porco Preto* (black pork)? 🐖
Have you ever tried **Portuguese-style BBQ**? 🍖 *Espetadas*, or skewered meats, are a Madeira Island specialty. Traditionally grilled over an open flame and seasoned simply with garlic, bay leaves, and salt, they’re served with crispy potatoes and a drizzle of olive oil. Perfect for outdoor gatherings!
**Craving fried goodness?** *Rissóis de Camarão* are golden, crescent-shaped empanadas filled with a creamy shrimp filling. These savory snacks are found in bakeries across Portugal and are perfect for parties or casual snacking. Pair with a cold beer for the ultimate combo! 🍤🍺
Want to sip like a local? 🍸 Try *Ginjinha*, a sweet cherry liqueur that’s often served in a tiny chocolate cup. It’s a Lisbon favorite, especially in the Bairro Alto district. Visit one of the iconic ginjinha bars next time you’re in Portugal—or try making your own at home!
**Dessert spotlight:** *Toucinho do Céu* (literally “Bacon from Heaven”) isn’t made with bacon but gets its name from its heavenly flavor. This rich almond cake is infused with egg yolks and sugar—a legacy of Portuguese convent recipes. Perfect with tea or coffee. 🍮
🌊 Dreaming of coastal Portugal? Try cooking *Amêijoas à Bulhão Pato* at home: fresh clams sautéed with garlic, olive oil, lemon, and cilantro. Serve with crusty bread to soak up the flavorful broth—it’s like bringing the seaside to your kitchen! 🐚
Looking for a *quick snack*? Portugal’s *Bifanas* are mouthwatering pork sandwiches seasoned with garlic and white wine. Usually served in a soft roll, they’re simple yet packed with flavor. Pair with mustard or hot sauce for a spicy kick! 🥪
Are you a fan of **regional specialties**? Don’t miss the Alentejo region’s *Açorda Alentejana*, a comforting garlic and cilantro bread soup topped with a poached egg. Rustic, humble, and unforgettable. 🍳
*Thinking of a drink?* Portugal is famous for its **Port wine**, but don’t overlook *Moscatel de Setúbal*. This sweet dessert wine boasts flavors of honey, orange blossom, and dried fruits. Pair it with cheese or pastries for a true indulgence. 🍷
🇵🇹 *Did you know?* Lisbon is famous for its **rooftop bars**, where you can enjoy drinks like *Porto Tonic* (white port and tonic water) while overlooking iconic landmarks like the Tagus River or São Jorge Castle. A truly unforgettable experience!`;

export const seedMessages = (
  { db, server }: { db: Database; server: string },
) => {
  const user = db
    .prepare("SELECT user FROM server_memberships WHERE server = :server")
    .all<{ user: string }>({ server }).map((u) => u.user)[0];
  const channel = db
    .prepare("SELECT id FROM channels WHERE server = :server")
    .get<{ id: string }>({ server })!.id;

  messagingSeed.split("\n").forEach((text, i) => {
    db.prepare(
      `INSERT INTO messages (uri, channel, server, text, sender, created_at, time_us) VALUES (
      :uri, :channel, :server, :text, :sender, :created_at, :time_us
    )`,
    ).run({
      uri:
        `at://did:plc:ubdeopbbkbgedccgbum7dhsh/chat.tinychat.core.message/3lge2rgfhox2b${i}`,
      channel,
      server,
      text: `[${i + 1}] ${text}`,
      sender: user,
      created_at: new Date().toISOString(),
      time_us: `${new Date().getTime() * 1000 + 60 * (i * 1000)}`, // add offset that is based on minute * i
    });
  });
};
