const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");

const client = new OpenAIClient(
  "https://devcodeai.openai.azure.com/", 
  new AzureKeyCredential("cc6fbbeb2a99477caff36a3561413c0f")
);

export default async function (req, res) {
  const text = req.body.text || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      }
    });
    return;
  }

  try {
    const prompt = generatePrompt(text);
    const { id, created, choices, usage } = await client.getChatCompletions(
      "gpt35turbo",
      prompt,
      '2023-07-01-preview'
    );

    res.status(200).json({ result: choices[0].message.content });
  } catch(error) {
    console.error(`Error with OpenAI API request: ${error.message}`);
    res.status(500).json({
      error: {
        message: 'An error occurred during your request.',
      }
    });
  }
}

function generatePrompt ( prompt )
{
  // prompt sepesifik easy/medium/hard
  const systemPrompt = `
      You are a virtual assistant tasked with generating competitive programming challenges. Your task is to respond with a validated JSON format containing the title, task name, and examples of the challenge. The challenges will be in Bahasa Indonesia. For each challenge, you must provide a minimum of 4 positive test cases as well as include two simple test cases along with the step-by-step solution to the related case. Also, note that for each challenge that you generate, please limit the data type to primitive only (integer, boolean, string, and/or array). Please provide a clear and functional code example in TypeScript, including comments and meaningful variable names. Make sure to use a straightforward function name.

      RULES FOR YOU:
      - Don't give the user a random result example like "acak isi array" because in our program, tests must check that the result is consistent.
      - Follow the pattern I give you.
      - In implementation, it must be solvable by the user.
      - Please make the content of 'Deskripsi' all about the main character's activities, the film's conflict, or storyline.
      - The content of 'Contoh Kasus' is all about the story, and the story you can make as long and creative as you can.
      - Don't create functions with fewer than 1 parameter, such as 'totalEpisode()'. You can change this to 'totalEpisode(seasons: array)' or 'totalEpisode(season1: number, season2: number)' or whatever you want and connect it to the context of the quest.
      - Information parameters must be complex, not simple, and the parameters must connect with the object in the story.
      - You can be creative, but you must follow the pattern I give you.
      - The context with the title must clearly match what it's going to be.
      - Be creative in 'Contoh Kasus,' and the value is supposed to have 2 conditions, not more or less. The value in the story should not say "fungsi" (function). A correct example is like "Pada ..., Andi berhasil ...., jadi..." and the second condition "pada..., Andi berhasil......, jadi....". If the parameter in 'Contoh Kasus' is like "namaDepan," change it to "nama depan." Don't write explicit data structures. For example, if 'season' is an array, don't explicitly state the data type or value like "season = [10,23,23]" or "array dalam season," but describe it in another way, like telling a story. The value in 'Contoh Kasus' must be complex, not simple.
      - If the output is a float then it can only be rounded to a maximum of two decimal places, make sure the generated code also handles rounding to two decimal digits.
      - Do not return null value.
      - Do not give array of objects.
      - Show the array values.

      After you generate test cases for each challenge, check the number of test cases that you have generated. If the number is less than 4, automatically add additional test cases with relevant input and output values to ensure there are at least 4 test cases. Please also check that the test cases do not have any empty values. If there are empty values, please remove them and change them to new test cases.

      For primitive data types, please note the following:
      - For strings, enclose string values within double quotation marks.
      - For integers, simply provide the numeric value without any quotation marks.
      - For floats, simply provide the numeric value without any quotation marks using "." as the decimal separator.
      - For booleans, use the keywords "true" or "false" without any quotation marks.
      - For arrays, enclose the array values within square brackets, with each value separated by a comma.
      - For arrays, the values can only be primitive data types (integer, float, boolean, or string). For example:
      - array of integers: [1, 2, 3, 4, 5]
      - array of strings: ["apple", "banana", "cherry", "durian", "eggplant"]
      - array of booleans: [true, false, true, false, true]
      - array of floats: [3.14, 2.71, 1.41, 1.61, 1.73]

      A question is going to be a story, and the title should connect with the problem story. For the function name, don't specify what the function is for. For example, 'selisihJarak' implies subtraction but doesn't explicitly state 'pengurangan.'

      In addition, consider that the length of the question description and the length of function implementation also play a major role in determining the difficulty level. Typically, harder questions tend to have longer descriptions and longer function implementations, providing more complex requirements and requiring a greater level of comprehension and logic analysis to solve. This correlation between question difficulty, description length, and function implementation length can further aid in categorizing questions accurately.
    `
  
  // Create an array of message objects with roles and content
  const messages = [
    {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content:
            "Penjumlahan Dua Bilangan",
        },
        {
           role: "assistant",
          content: `[\n    {\n        \"context\": \"Penjumlahan Dua Bilangan\",\n        \"title\": \"Total Pemberian Apel\",\n        \"description\": \"**Nama Soal**: Total Pemberian Apel.\\n\\n**Deskripsi**: Ini adalah cerita tentang dua sahabat, Amin dan Budi. Mereka suka sekali bermain bersama dan suka sekali mengerjakan PR bersama. Suatu saat Amin dan Budi meminta bantuan mu untuk mengerjakan PR mereka dan imbalannya itu berupa apel. Semakin lama kamu membantu mereka, imbalan tersebut menjadi banyak. Jadi kamu perlu fungsi yang bisa membantu kamu menghitung total pemberian dari mereka per bantuannya.\\n\\n**Aturan**:\\n- Buatlah sebuah function dengan nama totalPemberianApel yang menerima dua parameter: apelAmin (integer) dan apelBudi (integer).\\n- Function harus mengembalikan nilai berupa bilangan bulat hasil total kedua pemberian apel tersebut (integer).\\n\\n**Contoh Kasus**:\\n- Saat PR nya sudah kamu bantu, Amin memberikan mu 2 buah apel dan Budi memberikan mu 3 buah apel. Jadi total apel yang kamu miliki pada saat itu adalah 5 buah apel.\\n- Pada bantuan berikutnya, Amin memberikan mu 7 apel dan Budi memberikan mu 2 apel. Jadi total apel yang kamu miliki pada saat itu adalah 9 buah apel.\",\n        \"difficultyLevel\": 5,\n        \"timeEstimationToFinish\": \"5 minutes\",\n        \"hashtags\": \"programming, elementary grade, algorithm, mathematics\"\n    }\n]`,
        },
        {
          role: "user",
          content:
            "Pengurangan Dua Bilangan",
        },
        {
          role: "assistant",
          content: `[\n    {\n        \"context\": \"Pengurangan Dua Bilangan\",\n        \"title\": \"Selisih Jarak\",\n        \"description\": \"**Nama Soal**: Total Pemberian Apel.\\n\\n**Deskripsi**: Ini adalah cerita tentang dua sahabat, Jamjam dan Ranca, yang sedang berlibur di sebuah kota yang indah. Mereka berdua sangat antusias menjelajahi tempat-tempat wisata di sekitar kota tersebut. Selama liburan, mereka mencatat berapa banyak kilometer yang mereka tempuh setiap hari. Suatu saat mereka membutuhkan fungsi yang bisa menghitung selisih jarak antara mereka berdua.\\n\\n**Aturan**:\\n- Buatlah sebuah function dengan nama selisihJarak yang menerima dua parameter: jarakJamjam (integer) dan jarakRanca (integer).\\n- Function harus mengembalikan nilai berupa selisih jarak yang ditempuh oleh jamjam dan ranca (integer).\\n\\n**Contoh Kasus**:\\n- Pada hari pertama liburan, Jamjam berjalan sejauh 10 kilometer dan Ranca berjalan sejauh 7 kilometer. Jadi selisih jarak yang ditempuh oleh Jamjam dan Ranca pada hari pertama adalah 3 kilometer.\\n- Pada hari kedua, Jamjam mencatat bahwa dia berjalan sejauh 15 kilometer, sementara Ranca hanya berjalan sejauh 9 kilometer. Jadi selisih jarak yang ditempuh oleh Jamjam dan Ranca pada hari pertama adalah 6 kilometer.\",\n        \"difficultyLevel\": 5,\n        \"timeEstimationToFinish\": \"5 minutes\",\n        \"hashtags\": \"programming, elementary grade, algorithm, mathematics\"\n    }\n]`,
    },
    {
          role: "user",
          content:
            "Perkalian",
        },
        {
          role: "assistant",
          content: `[\n    {\n        \"context\": \"Perkalian Dua Bilangan\",\n        \"title\": \"Total Jajanan Terjual\",\n        \"description\": \"**Nama Soal**: Total Jajanan Terjual.\\n\\n**Deskripsi**: Rere adalah seorang yang gemar berjualan berbagai macam jajanan di sekolahnya. Setiap hari, dia dengan antusias menjual menu yang berbeda kepada teman-temannya. Misalnya, setiap hari Senin, Rere menjual coklat dalam kemasan yang berisi 5 pcs coklat, kemudian pada hari Selasa, dia beralih ke stroberi yang dikemas dalam kemasan yang berisi 3 pcs stroberi, dan begitu seterusnya dengan menu-menu lainnya. Suatu ketika, Rere merasa perlu untuk memiliki sebuah fungsi yang dapat menghitung total jajanan yang berhasil terjual setiap harinya.\\n\\n**Aturan**:\\n- Buatlah sebuah fungsi dengan nama 'totalPcs' yang menerima dua parameter: kemasan (integer) dan pcs (integer).\\n- Fungsi ini harus mengembalikan nilai berupa total jajanan yang berhasil terjual oleh Rere dalam satuan pcs (integer).\\n\\n**Contoh Kasus**:\\n- Misalnya, pada hari pertama di sekolah, Rere menjual coklat dan berhasil menjual sebanyak 10 kemasan yang berisi 5 pcs coklat. Jadi Rere berhasil menjual sebanyak 50 pcs coklat pada hari pertama.\\n- Di hari kedua sekolah, Rere menjual stroberi dan berhasil menjual 20 kemasan yang berisi 3 pcs stroberi. Jadi Rere berhasil menjual sebanyak 60 pcs stroberi pada hari kedua.\",\n        \"difficultyLevel\": 5,\n        \"timeEstimationToFinish\": \"5 minutes\",\n        \"hashtags\": \"programming, elementary grade, algorithm, mathematics, story\"\n    }\n]`,
    },
    {
          role: "user",
          content:
            "Menghitung jumlah karang yang dihancurkan oleh Plankton",
        },
        {
          role: "assistant",
          content: `[\n    {\n        \"context\": \"Menghitung Jumlah Karang\",\n        \"title\": \"Total Karang yang Dihancurkan\",\n        \"description\": \"**Nama Soal**: Total Karang yang Dihancurkan.\\n\\n**Deskripsi**: Di dasar laut Bikini Bottom, terdapat sebuah makhluk jahat bernama Plankton. Plankton memiliki misi jahat untuk menghancurkan seluruh karang di lautan. Setiap kali Plankton berhasil menghancurkan satu karang, jumlah karang yang hancur bertambah. Sementara itu, Spongebob yang merupakan penduduk terbaik Bikini Bottom memiliki tugas untuk mencatat jumlah karang yang berhasil dihancurkan oleh Plankton setiap harinya. Plankton dan Spongebob membutuhkan bantuanmu untuk membuat sebuah fungsi yang dapat menghitung total karang yang telah dihancurkan oleh Plankton.\\n\\n**Aturan**:\\n- Buatlah sebuah fungsi dengan nama 'totalKarang' yang menerima dua parameter: karangTelahHancur (integer) dan karangDiHancurkan (integer).\\n- Fungsi ini harus mengembalikan nilai berupa total karang yang telah dihancurkan oleh Plankton (integer).\\n\\n**Contoh Kasus**:\\n- Pada hari pertama, Plankton berhasil menghancurkan 3 karang. Jadi total karang yang dihancurkan oleh Plankton pada hari pertama adalah 3 karang.\\n- Pada hari kedua, Plankton berhasil menghancurkan 5 karang. Jadi total karang yang dihancurkan oleh Plankton pada hari kedua adalah 8 karang.\",\n        \"difficultyLevel\": 5,\n        \"timeEstimationToFinish\": \"5 minutes\",\n        \"hashtags\": \"programming, elementary grade, algorithm, mathematics, story\"\n    }\n]`,
    },
    {
          role: "user",
          content:
            "Menghitung jumlah karang yang dihancurkan oleh Plankton",
        },
        {
          role: "assistant",
          content: `[\n    {\n        \"context\": \"Menghitung Jumlah Karang\",\n        \"title\": \"Total Karang yang Dihancurkan\",\n        \"description\": \"**Nama Soal**: Total Karang yang Dihancurkan.\\n\\n**Deskripsi**: Ini adalah cerita tentang persahabatan antara SpongeBob dan Squidward. SpongeBob adalah seorang yang ceria dan selalu berusaha membuat Squidward bahagia. Mereka berdua sering menghabiskan waktu bersama dan mengalami berbagai petualangan di Bikini Bottom. Kamu adalah seorang perekrut programmer yang ingin menguji kemampuan calon programmer dengan membuat sebuah fungsi yang dapat menghitung total episode yang menceritakan persahabatan SpongeBob dan Squidward.\\n\\n**Aturan**:\\n- Buatlah sebuah fungsi dengan nama 'totalEpisode' yang menerima dua parameter: episodeSpongeBob (array) dan episodeSquidward (array).\\n- Setiap elemen dalam array episodeSpongeBob dan episodeSquidward merepresentasikan apakah episode tersebut menceritakan persahabatan SpongeBob dan Squidward (true) atau tidak (false).\\n- Fungsi ini harus mengembalikan nilai berupa total episode yang menceritakan persahabatan SpongeBob dan Squidward (integer). \\n\\n**Contoh Kasus**:\\n- Terdapat 5 episode yang menceritakan persahabatan SpongeBob dan Squidward dalam array episodeSpongeBob dan episodeSquidward. Jadi total episode persahabatan SpongeBob dan Squidward adalah 5 episode.\\n- Dalam array episodeSpongeBob terdapat 3 episode yang menceritakan persahabatan SpongeBob dan Squidward, sedangkan dalam array episodeSquidward terdapat 2 episode yang menceritakan persahabatan mereka. Jadi total episode persahabatan SpongeBob dan Squidward adalah 2 episode.\",\n        \"difficultyLevel\": 5,\n        \"timeEstimationToFinish\": \"10 minutes\",\n        \"hashtags\": \"programming, elementary grade, algorithm, mathematics, story\"\n    }\n]`,
      },
        {
          role: "user",
          content: prompt,
        },
  ];

  return messages;
}
