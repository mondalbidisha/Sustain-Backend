/* eslint-disable max-len */
const badgeRules = [
  {
    'name': 'A to B',
    'description': 'Awarded for logging any 1 action from the following: Easy Rider (1 time), Walkabout (1 time), Blazing saddles (1 time).'
  },
  {
    'name': 'Average Joe',
    'description': 'Awarded for logging either one Hug a mug (1 time) action or both Skip the Sleeve (1 time) and Go topless (1 time) actions.'
  },
  {
    'name': 'Clean Machine',
    'description': 'Awarded for logging both Dry naturally (1 time) and Fill \'er up (1 time).'
  },
  {
    'name': 'Drive Happy',
    'description': 'Awarded for logging all of the following actions: Speed Efficiency (3 times), Share the Road (3 times), Phat Wheels (3 times), Errand Buster (3 times).'
  },
  {
    'name': 'Employee of the Month',
    'description': 'Awarded for logging both of the following actions: Beam me up (1 time) and Quittin\' time (1 time).'
  },
  {
    'name': 'Grease Money',
    'description': 'Awarded for logging all of the following actions: Phat Wheels (2 times), Emissions Check (2 times), Oil Change (2 times).'
  },
  {
    'name': 'Key to the City',
    'description': 'Awarded for logging any of the 2 following actions: Sunshine Savvy (2 times), Market Magic (2 times), Localore Love (2 times).'
  },
  {
    'name': 'Light Saver',
    'description': 'Awarded for logging either a Lights out (1 time) action or a LED Upgrade (1 time) action.'
  },
  {
    'name': 'Power Lunch',
    'description': 'Awarded for logging all 3 of the following actions: Lunch Box (1 time), Leftover Lunch (1 time), Cutlery Crusader (1 time).'
  },
  {
    'name': 'Recycle Boss',
    'description': 'Awarded for logging all of the following actions: Recycle Electronics (1 time), Plastic Fantastic (1 time), Recycle Fantastic (1 time).'
  },
  {
    'name': 'Reuse Rodeo',
    'description': 'Awarded for logging all 5 of the following actions: Thrift Shop (3 times), Reusable Shopping Bag (3 times), Reusable Mug (3 times), Reusable Water Bottle (3 times), Reusable Silverware (3 times).'
  },
  {
    'name': 'Shower Power',
    'description': 'Awarded for logging all 3 of the following actions: Low Flow Shower Head (2 times), Low Flow Shower Heads (2 times), Shorter Showers (2 times).'
  },
  {
    'name': 'Sleeping Beauty',
    'description': 'Awarded for logging both of the following actions: Energy Settings (1 time) and Turn Off the Monitor (1 time).'
  },
  {
    'name': 'Smarty Pants',
    'description': 'Awarded for logging both of the following actions: Update Thermostat Winter (1 time) and Update Thermostat Summer (1 time).'
  },
  {
    'name': 'Super Cycles',
    'description': 'Awarded for logging all 4 of the following actions: Washing smart (3 times), Smart drying (3 times), Washing cold (3 times), Line \'em up (3 times).'
  },
  {
    'name': 'Grocery Connoisseur',
    'description': 'Awarded for logging all 4 of the following actions: Don\'t shop hungry (2 times), Local Markets (2 times), Shopping List (2 times), Try New Things (2 times).'
  },
  {
    'name': 'Lean and Mean',
    'description': 'Awarded for logging all 6 of the following actions: Healthy Oils (1 time), Low Fat Yogurt (1 time), Low Fat Milk (1 time), Lean Protein (1 time), Vinaigrette Dressing (1 time), Plant Protein (1 time).'
  },
  {
    'name': 'Personal Chef',
    'description': 'Awarded for logging all 6 of the following actions: Balanced Plate (3 times), Cook At Home (3 times), Grill It (3 times), Pack Your Own Lunch (3 times), Eat Breakfast (3 times).'
  },
  {
    'name': 'Snack Attack',
    'description': 'Awarded for logging all 6 of the following actions: Snacks On The Go (1 time), Nut Butter (1 time), Fruit (1 time), Low Fat Yogurt (1 time), Natural Popcorn (1 time), Healthy Snacks (1 time).'
  },
  {
    'name': 'Vegginator',
    'description': 'Awarded for logging all 6 of the following actions: Plant Protein (3 times), Soy (3 times), Eat Greens (3 times), Side Salad (3 times), Leafy Greens (3 times), Meatless Monday (3 times).'
  },
  {
    'name': 'Whole-y Healthy',
    'description': 'Awarded for logging all 3 of the following actions: Whole Wheat Toast (2 times), Whole Grains (2 times), Whole Grain Recipe (2 times).'
  },
  {
    'name': 'Welcome Badge',
    'description': 'Awarded for logging any action for the first time ever.'
  },
  {
    'name': 'Body Work',
    'description': 'Awarded for logging all 8 of the following actions: 7 Minute Workout (1 time), Burpees (1 time), Jumping Jacks (1 time), Jumping Rope (1 time), Pull Ups (1 time), Push Ups (1 time), Sit Ups (1 time), Squats (1 time).'
  },
  {
    'name': 'Class System',
    'description': 'Awarded for logging all 6 of the following actions: Cardio Class (1 time), Dancing (1 time), Kickboxing (1 time), Martial Arts (1 time), Zumba (1 time), Yoga (1 time).'
  },
  {
    'name': 'Great Outdoors',
    'description': 'Awarded for logging any 5 of the following actions: Baseball (1 time), Cycling (1 time), Field Hockey (1 time), Football (1 time), Frisbee (1 time), Gardening (1 time), Golf (1 time), Hiking (1 time), Lacrosse (1 time), Rugby (1 time), Rock Climbing (1 time), Running (1 time), Soccer (1 time), Swimming (1 time), Tennis (1 time), Walking (1 time), Rollerblading (1 time).'
  },
  {
    'name': 'Gym Rat',
    'description': 'Awarded for logging any 4 of the following actions: Boxing (1 time), Cardio Class (1 time), Circuit Training (1 time), Elliptical (1 time), Indoor Rowing (1 time), Kickboxing (1 time), Stationary Bike (1 time), Weight Lifting (1 time), Racquetball (1 time), Rock Climbing (1 time).'
  },
  {
    'name': 'Set for Success',
    'description': 'Awarded for logging any 4 of the following actions: Coffee Break Replacement (1 time), Join a Team (1 time), One Stop Early (1 time), Walk or Ride to Work (1 time), Workout Buddy (1 time), After Workout Snack (1 time).'
  },
  {
    'name': 'Super Sport',
    'description': 'Awarded for logging basketball (1 time), football (1 time), baseball (1 time), soccer (1 time), and volleyball (1 time).'
  },
  {
    'name': 'Take a Punch',
    'description': 'Awarded for logging all 3 of the following actions: Boxing (1 time), Kickboxing (1 time), Martial Arts (1 time).'
  },
  {
    'name': 'Zenned Out',
    'description': 'Awarded for logging stretching (1 time), cardio class (1 time), strength training (1 time), meditation (1 time), and yoga (1 time).'
  },
  {
    'name': 'Ally',
    'description': 'Awarded for logging both of the following actions: LGBTQ+ Ally Event (1 time), Diversity Event (1 time).'
  },
  {
    'name': 'Connections',
    'description': 'Awarded for logging all 3 of the following actions: Coworker Lunch (2 times), Greeting (2 times), Make a Friend (2 times).'
  },
  {
    'name': 'Empathy',
    'description': 'Awarded for logging both of the following actions: Considering Navigation (1 time), Screen Reader (1 time).'
  },
  {
    'name': 'Global Foodie',
    'description': 'Awarded for logging both of the following actions: Cook a New Recipe (2 times), Try a New Meal (2 times).'
  },
  {
    'name': 'Local Champion',
    'description': 'Awarded for logging all 3 of the following actions: Cultural Institution (2 times), Volunteer (2 times), Support Local (2 times).'
  },
  {
    'name': 'Vantage Point',
    'description': 'Awarded for logging new perspectives from movies (1 time), music (1 time), books (1 time), and shows (1 time).'
  },
  {
    'name': 'Zero Waste',
    'description': 'Awarded for logging all 5 of the following actions: Reduce (3 times), Reuse (3 times), Recycle (3 times), Upcycle (3 times), Compost (3 times).'
  }
];
  
module.exports = {
  badgeRules
};