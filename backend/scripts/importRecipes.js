const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
require('dotenv').config();

// Base recipes data from frontend
const BASE_RECIPES = [
  {
    title: 'Classic Pasta Carbonara',
    description: 'A traditional Italian pasta dish with eggs, cheese, pancetta, and black pepper',
    image: 'https://i.pinimg.com/736x/35/6f/bd/356fbdfc455bf711f115e60dcd3b7704.jpg',
    time: '30 mins',
    difficulty: 'Medium',
    category: 'Italian',
    state: 'Lazio',
    country: 'Italy',
    rating: 4.5,
    ingredients: [
      '200 grams spaghetti (or any long pasta)',
      '3 egg yolks (use only the yellow part of 3 eggs)',
      '½ cup grated cheese (Amul, Go Cheese, or any processed cheese)',
      '100 grams chicken sausage or bacon (cut into small pieces)',
      '1 teaspoon black pepper powder (freshly ground if possible)',
      '1 teaspoon salt',
      '1 teaspoon cooking oil (olive oil or sunflower oil)',
      '6 cups water (for boiling pasta)'
    ],
    steps: [
      {
        title: 'Boil the Pasta (10 minutes)',
        instructions: [
          'Take a large cooking pot and pour in 6 cups of water.',
          'Add 1 teaspoon of salt and 1 teaspoon of oil to the water.',
          'Place the pot on the stove and bring the water to a boil on high flame (about 5 minutes).',
          'Once boiling, add 200 grams of spaghetti to the pot.',
          'Let it cook for 8 to 10 minutes, stirring occasionally, until the pasta is soft but still firm to bite (this is called al dente).',
          'Before draining, save 1 cup of pasta water in a separate bowl — you\'ll need it later.',
          'Drain the rest of the water and keep the boiled pasta aside.'
        ]
      },
      {
        title: 'Prepare the Sauce (5 minutes)',
        instructions: [
          'In a clean bowl, add:',
          '3 egg yolks',
          '½ cup grated cheese',
          '1 teaspoon black pepper powder',
          'Use a spoon or fork to mix everything well. The mixture should look smooth and creamy.',
          'Keep this sauce mixture aside for later.'
        ]
      },
      {
        title: 'Cook the Chicken or Sausage (5–7 minutes)',
        instructions: [
          'Place a frying pan on the stove and add a few drops of oil (you can use olive oil or any cooking oil).',
          'Add 100 grams of chopped chicken sausage or bacon to the pan.',
          'Cook it on medium flame for 5 to 7 minutes, stirring occasionally.',
          'Cook until the meat becomes light brown and crispy.',
          'Turn off the stove and keep the pan aside (do not remove the meat).'
        ]
      },
      {
        title: 'Mix Pasta and Sauce (5 minutes)',
        instructions: [
          'Add the boiled pasta into the pan with the cooked sausage.',
          'Make sure the flame is off — this is important so the egg sauce doesn\'t turn into scrambled eggs.',
          'Pour the prepared egg and cheese sauce slowly into the pan.',
          'Quickly and gently mix everything using a spoon or tongs so that the pasta gets coated evenly.',
          'Add a little bit of the saved pasta water (about 2–3 tablespoons at a time) to loosen the sauce.',
          'Keep mixing for 2 to 3 minutes, until the sauce becomes smooth and creamy and sticks to the pasta nicely.'
        ]
      },
      {
        title: 'Serve the Pasta (2 minutes)',
        instructions: [
          'Transfer the creamy pasta to serving plates or bowls.',
          'Sprinkle a little extra grated cheese and black pepper on top for extra taste.',
          'Serve hot. You can enjoy it with garlic bread or fresh salad.'
        ]
      }
    ],
    tips: [
      'Never pour the egg sauce while the pan is on heat — the eggs will cook and become lumpy. Always mix it with the heat off.',
      'Want a vegetarian version? Replace the meat with mushrooms or paneer cubes, and cook the same way.',
      'For better flavor, use freshly ground black pepper instead of packed powder.'
    ]
  },
  {
    title: 'Chocolate Lava Cake',
    description: 'Decadent chocolate cake with a gooey molten center',
    image: 'https://i.pinimg.com/736x/0f/31/4e/0f314ee3708d4c2bd3016eb64bc70d9f.jpg',
    time: '25 mins',
    difficulty: 'Medium',
    category: 'Italian',
    state: 'Lazio',
    country: 'Italy',
    rating: 4.9,
    ingredients: [
      '100 grams dark chocolate (Morde / Amul dark chocolate or Bournville)',
      '50 grams unsalted butter (Amul butter - skip salt if using salted butter)',
      '2 whole eggs (fresh desi eggs)',
      '¼ cup powdered sugar (about 50 grams)',
      '2 tablespoons all-purpose flour (maida)',
      '½ teaspoon vanilla essence (optional but adds nice flavor)',
      'A pinch of salt (skip if using salted butter)',
      '1 teaspoon cocoa powder (for dusting the ramekins/moulds)',
      '1 teaspoon butter (for greasing the cups/moulds)'
    ],
    equipment: [
      '2 small steel cups, ramekins, or silicone moulds',
      'Oven / OTG / Air fryer',
      'Mixing bowl, spoon, whisk'
    ],
    steps: [
      {
        title: 'Prepare the Moulds (5 minutes)',
        instructions: [
          'Take 2 small steel bowls or ramekins.',
          'Grease the inside with butter.',
          'Optionally, dust them with a little cocoa powder to prevent sticking.',
          'Keep aside.'
        ]
      },
      {
        title: 'Melt Chocolate and Butter (5 minutes)',
        instructions: [
          'In a bowl, add:',
          '100g chopped dark chocolate',
          '50g butter',
          'Melt this using a double boiler (place the bowl over a pot of hot water) or use a microwave (30 seconds at a time, stir in between).',
          'Stir until the mixture becomes smooth and shiny.'
        ]
      },
      {
        title: 'Mix Eggs and Sugar (3–4 minutes)',
        instructions: [
          'In another bowl, add:',
          '2 eggs',
          '¼ cup powdered sugar',
          'Whisk well using a hand whisk or fork until the mixture becomes slightly frothy and pale.'
        ]
      },
      {
        title: 'Combine Everything (3 minutes)',
        instructions: [
          'Slowly add the melted chocolate-butter mix into the egg-sugar mix.',
          'Stir gently until combined.',
          'Add:',
          '2 tablespoons maida (all-purpose flour)',
          '½ teaspoon vanilla essence',
          'A pinch of salt (only if you used unsalted butter)',
          'Mix until you get a smooth batter.'
        ]
      },
      {
        title: 'Fill and Bake (12–14 minutes)',
        instructions: [
          'Pour the batter evenly into the greased moulds (fill about ¾th full).',
          'Preheat your oven to 200°C (392°F).',
          'Place the moulds in the oven and bake for 12–14 minutes:',
          'The top should be set, but the center will still be soft.',
          'Do not overbake, or the lava won\'t flow.',
          'Air Fryer: Bake at 180°C for about 10–12 minutes.'
        ]
      },
      {
        title: 'Serve the Lava Cake (2–3 minutes)',
        instructions: [
          'Let the cakes rest for 2 minutes after baking.',
          'Run a knife around the edges gently to loosen them.',
          'Invert the moulds onto a plate and tap lightly to unmould.',
          'Serve hot with:',
          'A scoop of vanilla ice cream',
          'Dusting of powdered sugar',
          'Or a drizzle of chocolate syrup'
        ]
      }
    ],
    tips: [
      'If you don\'t have an oven, you can steam the cakes in a kadai with a lid (like idli).',
      'You can use Amul dark chocolate or Bournville for best results.',
      'For eggless version: Use ½ cup curd + ¼ tsp baking soda instead of eggs.'
    ]
  },
  {
    title: 'Masala Dosa',
    description: 'Crispy fermented rice crepe filled with spiced potato filling, served with chutneys',
    image: 'https://i.pinimg.com/736x/68/c7/79/68c779b6c9f0774c6a3a2d94045c3c5c.jpg',
    time: '30 mins',
    difficulty: 'Medium',
    category: 'Indian',
    state: 'Karnataka',
    country: 'India',
    rating: 4.8,
    ingredients: [
      'For Dosa Batter:',
      '1 cup rice',
      '¼ cup urad dal (white lentils)',
      '½ teaspoon methi (fenugreek) seeds – optional',
      'Water – for soaking and grinding',
      '½ teaspoon salt',
      '',
      'For Potato Filling:',
      '3 boiled potatoes (peeled and mashed)',
      '1 onion (sliced thin)',
      '1 green chilli (chopped)',
      '½ teaspoon mustard seeds',
      '5–6 curry leaves',
      '¼ teaspoon turmeric (haldi) powder',
      '1 tablespoon oil',
      'Salt – to taste',
      'Few coriander leaves (optional)',
      '',
      'For Making the Dosa:',
      'Dosa batter',
      'Little oil or ghee (for cooking)'
    ],
    equipment: [
      'Mixer grinder or wet grinder',
      'Flat pan (tawa)',
      'Mixing bowls',
      'Ladle',
      'Spatula'
    ],
    steps: [
      {
        title: 'Make Dosa Batter (You need to make and let this sit for at least 8 hours before using it.)',
        instructions: [
          'Wash rice, urad dal, and methi seeds.',
          'Soak them in water for 6 hours.',
          'Grind them in a mixie using little water. Make a smooth paste.',
          'Add salt and mix.',
          'Keep the batter in a warm place for 8 hours or overnight. It will rise and become airy.',
          'You can skip this step if using ready-made dosa batter.'
        ]
      },
      {
        title: 'Make the Potato Masala (filling)',
        instructions: [
          'Heat oil in a pan.',
          'Add mustard seeds. Let them pop.',
          'Add curry leaves and green chilli.',
          'Add sliced onion. Cook till soft (about 2–3 minutes).',
          'Add turmeric powder and salt.',
          'Add mashed potatoes and mix well.',
          'Add little water if it feels dry.',
          'Turn off the stove and add chopped coriander (optional).'
        ]
      },
      {
        title: 'Make the Dosa',
        instructions: [
          'Heat a flat pan (tawa). Keep it on medium heat.',
          'Grease it lightly with oil.',
          'Pour a ladle of batter in the center.',
          'Spread it in circles using the back of the spoon.',
          'Add a few drops of oil on the sides.',
          'Cook till the bottom is golden and crispy (about 2–3 minutes).',
          'Put 2 spoons of potato masala in the center.',
          'Fold the dosa from both sides or roll it.'
        ]
      },
      {
        title: 'Serve',
        instructions: [
          'Serve dosa hot.',
          'Eat with coconut chutney, tomato chutney, or sambar.'
        ]
      }
    ],
    tips: [
      'To make dosa crispy, add a spoon of rava (sooji) in the batter.',
      'Mix the batter well before using.',
      'Use a hot pan, but not too hot. Sprinkle water and wipe with a cloth if it gets too hot.'
    ]
  }
];

// Andhra Pradesh recipes
const ANDHRA_RECIPES = [
  {
    title: 'Rava Kesari',
    description: 'A classic Andhra sweet made with semolina, ghee, and nuts, flavored with cardamom.',
    image: 'https://i.pinimg.com/736x/41/6a/81/416a819435f81db1fd36b025a2669ae3.jpg',
    time: '25 mins',
    difficulty: 'Easy',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.5,
    ingredients: [
      '1 cup Rava (Sooji / Semolina)',
      '1 to 1¼ cups Sugar (adjust to taste)',
      '2½ cups Water',
      '¼ to ½ cup Ghee (for richness)',
      '10–12 Cashews',
      '10 Raisins',
      '½ tsp Cardamom powder',
      'Orange food color or a few strands of saffron (optional)'
    ],
    steps: [
      {
        title: 'Roast rava',
        instructions: [
          'Heat 1 tsp ghee in a pan.',
          'Add rava and roast on low heat until it turns aromatic and light golden.',
          'Set aside.'
        ]
      },
      {
        title: 'Prepare sugar syrup',
        instructions: [
          'In another pan, boil water.',
          'Add sugar and stir until it dissolves.',
          'Add saffron strands or food color if using.'
        ]
      },
      {
        title: 'Cook the rava',
        instructions: [
          'Lower the heat and slowly add roasted rava to the boiling sugar water, stirring continuously to avoid lumps.'
        ]
      },
      {
        title: 'Simmer and finish',
        instructions: [
          'Cover and cook on low flame for a few minutes until rava absorbs the water and turns soft.',
          'Then add cardamom powder and ghee. Mix well.'
        ]
      },
      {
        title: 'Fry nuts & raisins',
        instructions: [
          'In a small pan, heat a little ghee and fry cashews until golden and raisins until they puff.',
          'Add them to the kesari.'
        ]
      },
      {
        title: 'Serve',
        instructions: [
          'Mix everything well. Serve hot or warm.'
        ]
      }
    ],
    tips: [
      'More ghee = smoother, richer Kesari.',
      'For extra aroma, you can add a few drops of rose water or edible camphor.',
      'You can replace water with half milk and half water for a richer taste.'
    ]
  },
  {
    title: 'Bobbatlu (Andhra Style Sweet Roti)',
    description: 'Traditional Andhra sweet flatbread stuffed with chana dal and jaggery filling.',
    image: 'https://i.pinimg.com/736x/f6/89/8c/f6898caca38ea45daa7f1a3aa3524608.jpg',
    time: '1 hour',
    difficulty: 'Medium',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.6,
    ingredients: [
      'For Outer Dough:',
      '1 cup maida (all-purpose flour)',
      '2 tablespoons oil or ghee',
      'Water – as needed to make dough',
      'A pinch of salt',
      '',
      'For Sweet Filling (Poornam):',
      '¾ cup chana dal (senagapappu / Bengal gram)',
      '¾ cup grated jaggery (or powdered jaggery)',
      '¼ teaspoon cardamom powder',
      '1 tablespoon ghee'
    ],
    steps: [
      {
        title: 'Make the Dough (10 minutes + 30 min rest)',
        instructions: [
          'In a bowl, add maida, salt, and 2 tbsp oil or ghee.',
          'Mix and slowly add water to make a soft dough.',
          'Cover the dough and rest it for 30 minutes.'
        ]
      },
      {
        title: 'Make the Sweet Filling (Poornam)',
        instructions: [
          'Wash and boil ¾ cup chana dal with water until soft (use a pressure cooker – 2–3 whistles).',
          'Drain water completely.',
          'Mash or grind the cooked dal into a thick paste.',
          'In a pan, add the dal paste and ¾ cup jaggery.',
          'Mix and cook on low flame until the jaggery melts and combines with dal.',
          'Add ¼ tsp cardamom powder.',
          'Stir till it becomes a thick, non-sticky mixture.',
          'Let it cool. Make small lemon-sized balls.'
        ]
      },
      {
        title: 'Make Bobbatlu',
        instructions: [
          'Make small balls from the rested dough.',
          'Flatten one dough ball with your fingers or rolling pin.',
          'Place one sweet filling ball inside and close it like a dumpling.',
          'Gently flatten it again to form a round shape (like a roti). Use a little oil if sticky.',
          'Heat a tawa (pan). Cook the bobbatlu on medium heat.',
          'Apply ghee and roast on both sides until golden spots appear.'
        ]
      },
      {
        title: 'Serve',
        instructions: [
          'Serve Bobbatlu hot with ghee on top.',
          'Can be eaten alone or with ghee'
        ]
      }
    ],
    tips: [
      'Always cool the sweet filling before stuffing.',
      'Use oil or ghee to roll and cook for better taste.',
      'You can store them in a box for 1–2 days.'
    ]
  },
  {
    title: 'Chakkera Pongali',
    description: 'A sweet and creamy rice-dal pudding from Andhra Pradesh, flavored with cardamom and garnished with nuts.',
    image: 'https://i.pinimg.com/736x/cb/10/b3/cb10b3093625004bbfc5c59cc74f9b4c.jpg',
    time: '35-40 mins',
    difficulty: 'Easy',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.7,
    ingredients: [
      '1 cup Raw rice',
      '¼ cup Moong dal (yellow split gram)',
      '¾ to 1 cup Sugar (as per taste)',
      '3 cups Water',
      '3 to 4 tablespoons Ghee',
      '½ teaspoon Cardamom powder',
      '10 to 12 Cashew nuts',
      '10 to 15 Raisins',
      '½ cup Milk (optional – for richness)'
    ],
    steps: [
      {
        title: 'Roast and Cook Dal-Rice',
        instructions: [
          'In a dry pan, roast ¼ cup moong dal on medium flame for 2–3 minutes until light golden and aromatic.',
          'Wash 1 cup raw rice and roasted dal together.',
          'Add 3 cups of water and pressure cook for 3 to 4 whistles until soft and mushy.'
        ]
      },
      {
        title: 'Add Sugar and Simmer',
        instructions: [
          'Open the cooker and lightly mash the cooked rice and dal.',
          'Add ¾ to 1 cup sugar directly and mix.',
          'Stir on low flame until sugar melts and blends well (about 5–7 minutes).',
          '(Optional) Add ½ cup milk for a creamy taste. Stir gently but do not boil.'
        ]
      },
      {
        title: 'Add Flavor',
        instructions: [
          'Add ½ tsp cardamom powder and mix well.'
        ]
      },
      {
        title: 'Fry Cashews and Raisins',
        instructions: [
          'In a small pan, heat 3 to 4 tbsp ghee.',
          'Fry cashews till golden.',
          'Add raisins and fry until they puff up.',
          'Add to the pongal and mix well.'
        ]
      },
      {
        title: 'Serve',
        instructions: [
          'Serve hot or warm in a bowl.',
          'Add extra ghee on top if you like for better taste.'
        ]
      }
    ],
    tips: [
      'Use fresh ghee for the best aroma and taste.',
      'Always roast the moong dal for extra flavor.',
      'Adjust sugar as per your preference.',
      'You can also make traditional Pongal using jaggery instead of sugar:',
      'Use 1 to 1¼ cups grated jaggery.',
      'Melt it with ½ cup water and strain before adding to cooked rice-dal.',
      'Jaggery gives a deep golden color and a rich, earthy taste — perfect for festivals like Sankranti or Ugadi.'
    ]
  },
  {
    title: 'Gunta Punugulu',
    description: 'Crispy, golden snack balls made from idli/dosa batter, popular in Andhra Pradesh. Perfect with chutneys!',
    image: 'https://i.pinimg.com/736x/63/b9/64/63b96465659dee74140786275bf48638.jpg',
    time: '25 mins',
    difficulty: 'Easy',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.4,
    ingredients: [
      '2 to 2½ cups Idli/Dosa batter (slightly sour is best)',
      '1 small Onion, finely chopped',
      '1–2 Green chilies, finely chopped',
      '1 tsp Ginger, finely chopped',
      'Few Curry leaves, finely chopped',
      'Coriander leaves, as needed, chopped',
      'Salt to taste (if not in batter)',
      'Oil for greasing the gunta (appe) pan',
      'Optional: Grated carrot or cabbage',
      'Optional: Crushed black pepper',
      'Optional: A pinch of baking soda (if the batter is not well fermented)'
    ],
    steps: [
      {
        title: 'Prepare the Batter',
        instructions: [
          'Take 2 to 2½ cups of idli or dosa batter in a bowl.',
          'Add chopped onions, green chilies, ginger, curry leaves, and coriander leaves.',
          'Add a little salt if it\'s not already in the batter.',
          'Mix well and let it sit for 10 to 15 minutes.'
        ]
      },
      {
        title: 'Heat the Gunta Pan',
        instructions: [
          'Place the gunta pan (appe pan) on medium flame.',
          'Add a few drops of oil in each cavity to prevent sticking.'
        ]
      },
      {
        title: 'Pour the Batter',
        instructions: [
          'Once the pan is hot, fill each cavity ¾ full with the batter.'
        ]
      },
      {
        title: 'Cook Until Golden',
        instructions: [
          'Cover the pan with a lid and cook for 2 to 3 minutes until the bottom is golden brown.',
          'Flip each ball using a spoon, skewer, or stick.',
          'Cook the other side until golden and crispy.'
        ]
      },
      {
        title: 'Serve Hot',
        instructions: [
          'Serve the Gunta Punugulu hot with coconut chutney, tomato chutney, or peanut chutney.'
        ]
      }
    ],
    tips: [
      'Batter should be slightly thick – not too watery – for a nice shape and crispiness.',
      'If using old or refrigerated batter, add a pinch of baking soda before cooking for extra fluffiness.',
      'To make it spicier, you can mix in red chili flakes or crushed garlic.'
    ]
  },
  {
    title: 'Garelu – Andhra Style Medu Vada',
    description: 'Crispy, fluffy lentil doughnuts made from urad dal, a classic breakfast and festival snack from Andhra Pradesh.',
    image: 'https://i.pinimg.com/736x/27/76/67/27766717a1c56520b181df00ee30fdc0.jpg',
    time: '5.5–6 hours (including soaking)',
    difficulty: 'Medium',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.6,
    ingredients: [
      '1 cup Urad dal (black gram, skinned)',
      '1–2 Green chilies, finely chopped',
      '1 tsp Ginger, grated',
      'Few Curry leaves, finely chopped',
      '1 small Onion (optional), finely chopped',
      '1 tsp Cumin seeds',
      'Salt to taste',
      'Minimal Water, for grinding only',
      'Oil for deep frying'
    ],
    steps: [
      {
        title: 'Soak and Grind the Dal',
        instructions: [
          'Soak 1 cup urad dal in water for 4 to 6 hours or overnight.',
          'Drain the water completely.',
          'Grind the dal into a thick, fluffy, and smooth batter by sprinkling little water as needed (don\'t add too much).',
          'Transfer to a bowl, add salt, and beat the batter well using your hand or spoon for 2–3 minutes to make it light and airy.'
        ]
      },
      {
        title: 'Add Flavors',
        instructions: [
          'Add chopped green chilies, ginger, curry leaves, cumin seeds, and onions (optional).',
          'Mix well. The batter should be thick enough to hold its shape.'
        ]
      },
      {
        title: 'Shape the Garelu',
        instructions: [
          'Heat oil in a deep frying pan on medium flame.',
          'Wet your hands with water.',
          'Take a lemon-sized ball of batter, flatten it gently on your palm or on a banana leaf.',
          'Make a small hole in the center (like a doughnut).'
        ]
      },
      {
        title: 'Deep Fry',
        instructions: [
          'Gently slide each garelu into the hot oil.',
          'Fry until golden and crispy on both sides (about 3–4 minutes per side).',
          'Remove and drain on a paper towel to remove excess oil.'
        ]
      },
      {
        title: 'Serve With',
        instructions: [
          'Serve hot with coconut chutney, ginger chutney (Allam Pachadi), or sambar.'
        ]
      }
    ],
    tips: [
      'Use wet hands for easy shaping and smooth surface.',
      'Beating the batter adds air and makes garelu soft and fluffy inside.',
      'If batter is too runny, garelu will absorb oil. If it\'s too thick, they\'ll be hard.',
      'Always fry on medium heat to ensure they cook evenly.'
    ]
  },
  {
    title: 'Upma – Andhra Style',
    description: 'A savory breakfast dish made from roasted semolina, tempered with spices and garnished with fresh herbs.',
    image: 'https://i.pinimg.com/736x/42/d0/30/42d0306fb44ac1f39323da9cd52aa114.jpg',
    time: '20–25 minutes',
    difficulty: 'Easy',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.3,
    ingredients: [
      '1 cup Rava (semolina/sooji)',
      '2½ to 3 cups Water',
      '2 tbsp Oil or ghee',
      '½ tsp Mustard seeds',
      '½ tsp Cumin seeds',
      '1 tsp Chana dal',
      '1 tsp Urad dal',
      '2 Green chilies, finely chopped',
      '1 tsp Ginger, grated',
      '1 medium Onion, chopped',
      'Few Curry leaves',
      'Salt to taste',
      '8–10 Cashew nuts (optional)',
      'Coriander leaves, for garnish',
      '1 tsp Lemon juice (optional)'
    ],
    steps: [
      {
        title: 'Roast the Rava',
        instructions: [
          'Heat a pan on medium flame.',
          'Add 1 cup rava and dry roast it for 4–5 minutes until you get a light golden color and nutty smell.',
          'Transfer to a plate and keep it aside.'
        ]
      },
      {
        title: 'Prepare the Tempering',
        instructions: [
          'In the same pan, heat 2 tbsp oil or ghee.',
          'Add:',
          '½ tsp mustard seeds',
          '½ tsp cumin seeds',
          '1 tsp chana dal',
          '1 tsp urad dal',
          'Let them turn golden brown.',
          'Add green chilies, grated ginger, curry leaves, and cashews (if using).',
          'Add chopped onions and sauté until they become soft and translucent (about 2–3 minutes).'
        ]
      },
      {
        title: 'Boil Water',
        instructions: [
          'Add 2½ to 3 cups of water and salt to taste.',
          'Bring the water to a rolling boil.'
        ]
      },
      {
        title: 'Add Roasted Rava',
        instructions: [
          'Slowly pour in the roasted rava while stirring continuously to avoid lumps.',
          'Stir until the rava absorbs all the water and starts to thicken (2–3 minutes).'
        ]
      },
      {
        title: 'Steam and Serve',
        instructions: [
          'Cover the pan and let it cook on low flame for 2–3 minutes.',
          'Turn off the heat and let it rest (covered) for 5 minutes.',
          'Fluff it gently with a fork.',
          'Garnish with fresh coriander leaves and lemon juice for added flavor (optional).'
        ]
      }
    ],
    tips: [
      'Don\'t skip roasting the rava — it prevents stickiness.',
      'Adjust water depending on how soft you want the upma (start with 2½ cups for slightly firmer texture).',
      'Stir well while adding rava to avoid lumps.',
      'You can add chopped vegetables like carrots or peas for a healthier version.'
    ]
  },
  {
    title: 'Idli – Traditional Recipe',
    description: 'Soft, fluffy steamed rice cakes, a staple breakfast from Andhra Pradesh, served with chutneys and sambar.',
    image: 'https://i.pinimg.com/736x/99/82/42/998242dff8364f11f8751a03f25c8596.jpg',
    time: '8-12 hours (including fermentation)',
    difficulty: 'Medium',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.8,
    ingredients: [
      '2 cups Idli rice',
      '1 cup Urad dal (whole skinned black gram)',
      '½ tsp Fenugreek seeds (methi)',
      'Salt to taste',
      'Water – as needed for soaking and grinding'
    ],
    steps: [
      {
        title: 'Soak the Ingredients',
        instructions: [
          'Wash and soak rice and urad dal separately for 4–6 hours.',
          'Add fenugreek seeds to the urad dal while soaking.'
        ]
      },
      {
        title: 'Grind the Batter',
        instructions: [
          'Grind urad dal first to a smooth, fluffy batter using minimal water.',
          'Then grind the rice to a slightly coarse batter.',
          'Mix both batters together with salt.',
          'The consistency should be pourable, but thick.'
        ]
      },
      {
        title: 'Ferment the Batter',
        instructions: [
          'Cover and let the batter ferment in a warm place for 8–12 hours or overnight.',
          'It should rise and become airy with a slight sour aroma.'
        ]
      },
      {
        title: 'Steam the Idlis',
        instructions: [
          'Grease idli moulds lightly.',
          'Pour batter into the moulds.',
          'Steam in an idli cooker or steamer for 10–12 minutes.',
          'Insert a toothpick to check – it should come out clean.'
        ]
      },
      {
        title: 'Serve',
        instructions: [
          'Serve hot with coconut chutney, tomato chutney, allam pachadi, or sambar.'
        ]
      }
    ],
    tips: [
      'Use wet grinder for best texture (traditional method).',
      'For soft idlis, ensure good fermentation and avoid overmixing the batter.',
      'If the weather is cold, keep the batter in a warm oven or near a light bulb to aid fermentation.'
    ]
  },
  {
    title: 'Gongura Mutton – Andhra Special',
    description: 'A tangy and spicy mutton curry made with gongura (sorrel) leaves, a signature dish from Andhra Pradesh.',
    image: 'https://i.pinimg.com/736x/af/68/0d/af680df90a9cc0d29df00de99fc8b45c.jpg',
    time: '60 mins',
    difficulty: 'Medium',
    category: 'Indian',
    state: 'Andhra Pradesh',
    country: 'India',
    rating: 4.9,
    ingredients: [
      'For Mutton Marination:',
      '500g Mutton (bone-in)',
      '½ tsp Turmeric',
      '1 tsp Red chili powder',
      '½ tsp Salt',
      '1 tbsp Ginger garlic paste',
      '',
      'For Gongura Preparation:',
      '2 cups Gongura leaves (sorrel) (tightly packed)',
      '2–3 Green chilies',
      '1 tsp Oil',
      '',
      'For Masala Base:',
      '2 large Onions (sliced)',
      '1 large Tomato (optional)',
      '2 Green chilies (slit)',
      '1 tbsp Ginger garlic paste',
      '1 sprig Curry leaves',
      '2 tsp Coriander powder',
      '1½ tsp Red chili powder (adjust to taste)',
      '¼ tsp Turmeric',
      '½ tsp Garam masala',
      'Salt to taste',
      '4 tbsp Oil'
    ],
    steps: [
      {
        title: 'Marinate Mutton',
        instructions: [
          'Combine mutton, turmeric, chili powder, salt, and ginger garlic paste.',
          'Let it marinate for 30 mins.'
        ]
      },
      {
        title: 'Pressure Cook Mutton',
        instructions: [
          'Heat 1 tbsp oil in a pressure cooker.',
          'Sauté onions and half of the curry leaves.',
          'Add marinated mutton; cook for 5 minutes.',
          'Add ½ cup water and pressure cook for 3–4 whistles or till soft.',
          'Set aside.'
        ]
      },
      {
        title: 'Prepare Gongura Paste',
        instructions: [
          'In a pan, heat 1 tsp oil and sauté gongura leaves with green chilies till wilted (5–7 mins).',
          'Let cool and grind into a coarse paste (without water).'
        ]
      },
      {
        title: 'Make the Masala',
        instructions: [
          'In a wide pan, heat 3 tbsp oil.',
          'Add remaining curry leaves, slit green chilies, and onions. Sauté until golden.',
          'Add ginger garlic paste, followed by coriander, turmeric, chili powder, and tomatoes.',
          'Cook till masala thickens and oil begins to separate.'
        ]
      },
      {
        title: 'Combine and Cook',
        instructions: [
          'Add cooked mutton with its juices. Sauté on high for 5 minutes.',
          'Mix in the gongura paste. Cook uncovered for 10–15 minutes.',
          'Add garam masala, stir well, and cook until oil separates and flavors deepen.'
        ]
      }
    ],
    tips: [
      'Gongura\'s natural tanginess complements spicy mutton.',
      'A unique Andhra delicacy reserved for festivals and family feasts.',
      'Serve with steamed rice and a dollop of ghee, or with jowar roti/ragi sangati.',
      'Accompany with raw onion slices and lemon wedges for the authentic experience.'
    ]
  }
];

const importRecipes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing recipes
    await Recipe.deleteMany({});
    console.log('Cleared existing recipes');

    // Combine all recipes
    const allRecipes = [...BASE_RECIPES, ...ANDHRA_RECIPES];

    // Insert recipes
    await Recipe.insertMany(allRecipes);
    console.log(`Successfully imported ${allRecipes.length} recipes`);

    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error importing recipes:', error);
    process.exit(1);
  }
};

importRecipes(); 