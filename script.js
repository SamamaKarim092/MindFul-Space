const fs = require('fs');
const path = require('path');
const file = 'e:/Git Hub/Mental-Health-Sentiment-Journal/src/app/components/about/ProductPillars.tsx';
let code = fs.readFileSync(file, 'utf8');

const startMarker = 'const JournalingVisual = () => (';
const endMarker = 'const TextReveal = ({';

let startIndex = code.indexOf(startMarker);
let endIndex = code.indexOf(endMarker);

const replacement = \const productPillars = [
  {
    title: "Private journaling",
    description: "A focused writing space dedicated solely to your entries, mood labels, and daily reflections. It stays completely private, ensuring that your personal history remains yours alone, providing a safe harbor where you can freely organize your thoughts away from external noise and distractions.",
    icon: HeartHandshake,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "AI sentiment guidance",
    description: "Integrated, n8n-powered analysis works entirely in the background to help translate your raw, unfiltered writing into readable emotional signals. It detects subtle shifts in your tone without interrupting your natural flow, providing a gentle analytical overlay to your everyday logging.",
    icon: Bot,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Conversation support",
    description: "Advanced chat workflows designed to respond dynamically using context directly extracted from your past journal entries. By remembering what you've documented previously, the platform offers a uniquely supportive, continuous, and highly personalized conversational experience.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Insightful analytics",
    description: "A suite of trends, emotional statistics, generated quotes, and interactive dashboard widgets that successfully turn your isolated daily entries into a longer-term, easily digestible picture of how you're doing, helping you spot critical patterns over weeks, months, or years.",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
];

\;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);

code = code.replace('<pillar.visual />', '<img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover" />');

const visualOld = \const VisualComponent = pillarData.visual;

                return (
                  <motion.div
                    key={\\\isual-\\\\\}
                    // Reverse z-index so index 0 is on top of index 1
                    style={{
                      zIndex: productPillars.length - reversedIndex,
                      clipPath: isLastItem
                        ? undefined
                        : useTransform(
                            clipPathBottom,
                            (val) => \\\inset(0px 0px \)\\\,
                          ),
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <motion.div
                      style={{
                        y: useTransform(
                          objectPositionY,
                          (val) => \\\calc(\ - 50%)\\\, // Simulating the image object-position shift via Y translate
                        ),
                      }}
                      className="w-full h-full"
                    >
                      <VisualComponent />
                    </motion.div>
                  </motion.div>
                );\;

const visualNew = \eturn (
                  <motion.div
                    key={\\\isual-\\\\\}
                    style={{
                      zIndex: productPillars.length - reversedIndex,
                      clipPath: isLastItem
                        ? undefined
                        : useTransform(
                            clipPathBottom,
                            (val) => \\\inset(0px 0px \)\\\,
                          ),
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <motion.img
                      src={pillarData.image}
                      alt={pillarData.title}
                      style={{
                        objectPosition: useTransform(
                          objectPositionY,
                          (val) => \\\50% \\\\,
                        ),
                      }}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                );\;

code = code.replace(visualOld, visualNew);
fs.writeFileSync(file, code, 'utf8');
