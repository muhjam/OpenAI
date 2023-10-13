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
  const systemPrompt = `
      You are a virtual assistant tasked with generating test code for the intuction what user give to you. Your task is to respond with a validated JSON. The test case must 4 array index.

      RULES FOR YOU:
      - Do not return null value.
      - Do not give array of objects.
    `
  
  // Create an array of message objects with roles and content
  const messages = [
    {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content:`
            Judul: Jumlah Anggota Tim 7 Naruto
            **Nama Soal**: Jumlah Anggota Tim 7 Naruto.

            **Aturan**:
            - Buatlah sebuah **function jumlahAnggotaTim7** dengan satu parameter: **anggotaTim7** (array).
            - Function ini harus **mengembalikan jumlah anggota dalam Tim 7 Naruto** (integer).

            **Contoh Kasus 1**:
            - Diketahui: **anggotaTim7 = ['Naruto', 'Sasuke', 'Sakura', 'Kakashi', 'Shikamaru', 'Ino', 'Hinata']**
            - Hasil: **7** (Jumlah anggota dalam Tim 7 Naruto adalah 7).

            **Contoh Kasus 2**:
            - Diketahui: **anggotaTim7 = ['Naruto', 'Sasuke', 'Sakura']**
            - Hasil: **3** (Jumlah anggota dalam Tim 7 Naruto adalah 3).
            `,
        },
        {
           role: "assistant",
          content: `[\n    {\n        \"inputParameter\": [\n            {\n                \"name\": \"anggotaTim7\",\n                \"typeData\": \"array\"\n            }\n        ],\n        \"expectedTypeData\": \"integer\",\n        \"testCase\": [\n            {\n                \"inputParameter\": {\n                    \"anggotaTim7\": \"['Naruto', 'Sasuke', 'Sakura', 'Kakashi', 'Shikamaru', 'Ino', 'Hinata']\"\n                },\n                \"expectedValue\": 7\n            },\n            {\n                \"inputParameter\": {\n                    \"anggotaTim7\": \"['Naruto', 'Sasuke', 'Sakura']\"\n                },\n                \"expectedValue\": 3\n            },\n            {\n                \"inputParameter\": {\n                    \"anggotaTim7\": \"['Naruto', 'Sasuke', 'Sakura', 'Kakashi']\"\n                },\n                \"expectedValue\": 4\n            },\n            {\n                \"inputParameter\": {\n                    \"anggotaTim7\": \"['Naruto', 'Sasuke', 'Sakura', 'Kakashi', 'Shikamaru']\"\n                },\n                \"expectedValue\": 5\n            }\n        ],\n        \"implementation\": {\n            \"function\": \"function jumlahKarakterTim7(anggotaTim7: string[]): number {\\n  return anggotaTim7.length;\\n}\",\n            \"language\": \"Typescript\",\n            \"functionName\": \"jumlahKarakterTim7\"\n        }\n    }\n]`,
         },
         {
          role: "user",
           content:`
            Judul: Mencari Nama Ibu Jughead Jones
            **Nama Soal**: Mencari Nama Ibu Jughead Jones.

            **Aturan**:
            - Buatlah sebuah **function cariNamaIbu** tanpa parameter.
            - Function ini harus **mengembalikan nama ibu dari karakter Jughead Jones di serial Riverdale** (string).
            - Nama ibu dari Jughead Jones adalah **Gladys Jones**.

            **Contoh Kasus 1**:
            - Diketahui: **namaIbu = 'Gladys Jones'**
            - Hasil: true (Nama ibu Jughead Jones di serial Riverdale adalah Gladys Jones).

            **Contoh Kasus 2**:
            - Diketahui: **namaIbu = 'Betty'**
            - Hasil: *false** (Betty di serial Riverdale adalah pacar Jughead Jones).
            `,
        },
        {
          role: "assistant",
          content: `[\n    {\n        \"inputParameter\": [\n            {\n                \"name\": \"namaIbu\",\n                \"typeData\": \"string\"\n            }\n        ],\n        \"expectedTypeData\": \"boolean\",\n        \"testCase\": [\n            {\n                \"inputParameter\": {\n                    \"namaIbu\": \"Gladys Jones\"\n                },\n                \"expectedValue\": true\n            },\n            {\n                \"inputParameter\": {\n                    \"namaIbu\": \"Betty\"\n                },\n                \"expectedValue\": false\n            },\n            {\n                \"inputParameter\": {\n                    \"namaIbu\": \"Veronica\"\n                },\n                \"expectedValue\": false\n            },\n            {\n                \"inputParameter\": {\n                    \"namaIbu\": \"Archi\"\n                },\n                \"expectedValue\": false\n            }\n        ],\n        \"implementation\": {\n            \"function\": \"function namaIbuJughead(namaIbu: string): string {\\n  if (namaIbu === 'Gladys Jones') {\\n    return true;\\n  } else {\\n    return false;\\n  }\\n}\",\n            \"language\": \"Typescript\",\n            \"functionName\": \"namaIbuJughead\"\n        }\n    }\n]`,
    },
    {
          role: "user",
        content:`
        Judul: Pembagian Dua Bilangan  
        **Nama Soal**: Pembagian Dua Bilangan.
        
        **Deskripsi**: Challenge ini akan menguji kemampuanmu dalam melakukan pembagian dua bilangan. Kamu akan diberikan dua bilangan integer, dan tugasmu adalah membagi bilangan pertama dengan bilangan kedua untuk menghasilkan nilai yang benar.
        
        **Aturan**:
        - gunakan bahasa pemograman typescript.
        - Buatlah sebuah function dengan nama pembagian yang menerima dua parameter: bilangan1 (float) dan bilangan2 (float).
        - Function harus mengembalikan nilai berupa bilangan bulat hasil pembagian bilangan pertama dengan bilangan kedua (integer).
        
        **Contoh Kasus**:
        - Kita ambil kasus dimana parameter input bernilai 10.0 dan 2.0. Dalam kasus ini, hasil yang diperoleh adalah 5.0. Hasil ini didapatkan dengan melakukan pembagian bilangan pertama (10.0) dengan bilangan kedua (2.0).
        -  Kita ambil kasus dimana parameter input bernilai 15.0 dan 5.0. Dalam kasus ini, hasil yang diperoleh adalah 3.0. Hasil ini didapatkan dengan melakukan pembagian bilangan pertama (15.0) dengan bilangan kedua (5.0).
            `,
        },
        {
          role: "assistant",
          content: `[\n    {\n        \"inputParameter\": [\n            {\n                \"name\": \"bilangan1\",\n                \"typeData\": \"float\"\n            },\n            {\n                \"name\": \"bilangan2\",\n                \"typeData\": \"float\"\n            }\n        ],\n        \"expectedTypeData\": \"float\",\n        \"testCase\": [\n            {\n                \"inputParameter\": {\n                    \"bilangan1\": 10,\n                    \"bilangan2\": 2\n                },\n                \"expectedValue\": 5\n            },\n            {\n                \"inputParameter\": {\n                    \"bilangan1\": 15,\n                    \"bilangan2\": 5\n                },\n                \"expectedValue\": 3\n            },\n            {\n                \"inputParameter\": {\n                    \"bilangan1\": 1,\n                    \"bilangan2\": 1\n                },\n                \"expectedValue\": 1\n            },\n            {\n                \"inputParameter\": {\n                    \"bilangan1\": 100,\n                    \"bilangan2\": 50\n                },\n                \"expectedValue\": 2\n            }\n        ],\n        \"implementation\": {\n            \"function\": \"function pembagian(bilangan1: number, bilangan2: number): number {\\n return bilangan1 / bilangan2;\\n}\",\n            \"language\": \"Typescript\",\n            \"functionName\": \"pembagian\"\n        }\n    }\n]`,
    },
      {
        role: "user",
        content:`
           Judul: Luffy vs Doflamingo
           **Nama Soal**: Luffy vs Doflamingo.
           
           **Deskripsi**: Challenge ini akan menguji kemampuanmu dalam menentukan pemenang pertarungan antara Luffy dan Doflamingo. Kamu akan diberikan nilai kekuatan (dalam skala 1-100) untuk Luffy dan Doflamingo. Tugas kamu adalah menentukan siapa pemenang pertarungan berdasarkan nilai kekuatan yang diberikan.
           
           **Aturan**:
           - Buatlah sebuah function dengan nama pemenangPertarungan yang menerima dua parameter: kekuatanLuffy (integer) dan kekuatanDoflamingo (integer).
           - Function harus mengembalikan string 'Luffy' jika kekuatanLuffy lebih besar dari kekuatanDoflamingo, atau string 'Doflamingo' jika kekuatanDoflamingo lebih besar dari kekuatanLuffy. Jika kekuatanLuffy sama dengan kekuatanDoflamingo, maka kembalikan string 'Seri'.
           
           **Contoh Kasus**:
           - Kita ambil kasus dimana kekuatanLuffy bernilai 90 dan kekuatanDoflamingo bernilai 80. Dalam kasus ini, hasil yang diperoleh adalah 'Luffy' karena kekuatanLuffy lebih besar dari kekuatanDoflamingo.
           - Kita ambil kasus dimana kekuatanLuffy bernilai 70 dan kekuatanDoflamingo bernilai 90. Dalam kasus ini, hasil yang diperoleh adalah 'Doflamingo' karena kekuatanDoflamingo lebih besar dari kekuatanLuffy.
            `,
        },
        {
          role: "assistant",
          content: `[\n    {\n        \"inputParameter\": [\n            {\n                \"name\": \"kekuatanLuffy\",\n                \"typeData\": \"integer\"\n            },\n            {\n                \"name\": \"kekuatanDoflamingo\",\n                \"typeData\": \"integer\"\n            }\n        ],\n        \"expectedTypeData\": \"string\",\n        \"testCase\": [\n            {\n                \"inputParameter\": {\n                    \"kekuatanLuffy\": 90,\n                    \"kekuatanDoflamingo\": 80\n                },\n                \"expectedValue\": \"Luffy\"\n            },\n            {\n                \"inputParameter\": {\n                    \"kekuatanLuffy\": 70,\n                    \"kekuatanDoflamingo\": 90\n                },\n                \"expectedValue\": \"Doflamingo\"\n            },\n            {\n                \"inputParameter\": {\n                    \"kekuatanLuffy\": 100,\n                    \"kekuatanDoflamingo\": 100\n                },\n                \"expectedValue\": \"Seri\"\n            },\n            {\n                \"inputParameter\": {\n                    \"kekuatanLuffy\": 60,\n                    \"kekuatanDoflamingo\": 60\n                },\n                \"expectedValue\": \"Seri\"\n            }\n        ],\n        \"implementation\": {\n            \"function\": \"function pemenangPertarungan(kekuatanLuffy: number, kekuatanDoflamingo: number): string {\\n    if (kekuatanLuffy > kekuatanDoflamingo) {\\n        return 'Luffy';\\n    } else if (kekuatanDoflamingo > kekuatanLuffy) {\\n        return 'Doflamingo';\\n    } else {\\n        return 'Seri';\\n    }\\n}\",\n            \"language\": \"Typescript\",\n            \"functionName\": \"pemenangPertarungan\"\n        }\n    }\n]`,
    },
      {
          role: "user",
          content:`
          Judul: Total Pemberian Apel
          **Nama Soal**: Total Pemberian Apel.
          
          **Deskripsi**: Ini adalah cerita tentang dua sahabat, Amin dan Budi. Mereka suka sekali bermain bersama dan suka sekali mengerjakan PR bersama. Suatu saat Amin dan Budi meminta bantuan mu untuk mengerjakan PR mereka dan imbalannya itu berupa apel. Semakin lama kamu membantu mereka, imbalan tersebut menjadi banyak. Jadi kamu perlu fungsi yang bisa membantu kamu menghitung total pemberian dari mereka per bantuannya.
          
          **Aturan**
          - Buatlah sebuah function dengan nama totalPemberianApel yang menerima dua parameter: apelAmin (integer) dan apelBudi (integer).
          - Function harus mengembalikan nilai berupa bilangan bulat hasil total kedua pemberian apel tersebut (integer).
          
          **Contoh Kasus**:
          - Saat PR nya sudah kamu bantu, Amin memberikan mu 2 buah apel dan Budi memberikan mu 3 buah apel. Jadi total apel yang kamu miliki pada saat itu adalah 5 buah apel.
          - Pada bantuan berikutnya, Amin memberikan mu 7 apel dan Budi memberikan mu 2 apel. Jadi total apel yang kamu miliki pada saat itu adalah 9 buah apel.
          `,
      },
      {
        role: "assistant",
        content: `[\n    {\n        \"inputParameter\": [\n            {\n                \"name\": \"apelAmin\",\n                \"typeData\": \"integer\"\n            },\n            {\n                \"name\": \"apelBudi\",\n                \"typeData\": \"integer\"\n            }\n        ],\n        \"expectedTypeData\": \"integer\",\n        \"testCase\": [\n            {\n                \"inputParameter\": {\n                    \"apelAmin\": 2,\n                    \"apelBudi\": 3\n                },\n                \"expectedValue\": 5\n            },\n            {\n                \"inputParameter\": {\n                    \"apelAmin\": 7,\n                    \"apelBudi\": 2\n                },\n                \"expectedValue\": 9\n            },\n            {\n                \"inputParameter\": {\n                    \"apelAmin\": 10,\n                    \"apelBudi\": 5\n                },\n                \"expectedValue\": 15\n            },\n            {\n                \"inputParameter\": {\n                    \"apelAmin\": 100,\n                    \"apelBudi\": 50\n                },\n                \"expectedValue\": 150\n            }\n        ],\n        \"implementation\": {\n            \"function\": \"function totalPemberianApel(apelAmin: number, apelBudi: number): number {\\n return apelAmin + apelBudi; }\",\n            \"language\": \"Typescript\",\n            \"functionName\": \"totalPemberianApel\"\n        }\n    }\n]`,
  },
      {
        role: "user",
        content:`
          Judul: Total Karang yang Dihancurkan
          **Nama Soal**: Total Karang yang Dihancurkan.
          
          **Deskripsi**: Ini adalah cerita tentang persahabatan antara SpongeBob dan Squidward. SpongeBob adalah seorang yang ceria dan selalu berusaha membuat Squidward bahagia. Mereka berdua sering menghabiskan waktu bersama dan mengalami berbagai petualangan di Bikini Bottom. Kamu adalah seorang perekrut programmer yang ingin menguji kemampuan calon programmer dengan membuat sebuah fungsi yang dapat menghitung total episode yang menceritakan persahabatan SpongeBob dan Squidward.
          
          **Aturan**:
          - Buatlah sebuah fungsi dengan nama 'totalEpisode' yang menerima dua parameter: episodeSpongeBob (array) dan episodeSquidward (array).
          - Setiap elemen dalam array episodeSpongeBob dan episodeSquidward merepresentasikan apakah episode tersebut menceritakan persahabatan SpongeBob dan Squidward (true) atau tidak (false).
          - Fungsi ini harus mengembalikan nilai berupa total episode yang menceritakan persahabatan SpongeBob dan Squidward (integer). 
          
          **Contoh Kasus**:
          - Terdapat 5 episode yang menceritakan persahabatan SpongeBob dan Squidward dalam array episodeSpongeBob dan episodeSquidward. Jadi total episode persahabatan SpongeBob dan Squidward adalah 5 episode.- Dalam array episodeSpongeBob terdapat 3 episode yang menceritakan persahabatan SpongeBob dan Squidward, sedangkan dalam array episodeSquidward terdapat 2 episode yang menceritakan persahabatan mereka. Jadi total episode persahabatan SpongeBob dan Squidward adalah 2 episode.
          `,
      },
      {
        role: "assistant",
        content: `[\n    {\n        \"inputParameter\": [\n            {\n                \"name\": \"episodeSpongeBob\",\n                \"typeData\": \"array\"\n            },\n            {\n                \"name\": \"episodeSquidward\",\n                \"typeData\": \"array\"\n            }\n        ],\n        \"expectedTypeData\": \"integer\",\n        \"testCase\": [\n            {\n                \"inputParameter\": {\n                    \"episodeSpongeBob\": [\n                        true,\n                        true,\n                        true,\n                        true,\n                        true\n                    ],\n                    \"episodeSquidward\": [\n                        true,\n                        true,\n                        true,\n                        true,\n                        true\n                    ]\n                },\n                \"expectedValue\": 5\n            },\n            {\n                \"inputParameter\": {\n                    \"episodeSpongeBob\": [\n                        true,\n                        true,\n                        true,\n                        false,\n                        false\n                    ],\n                    \"episodeSquidward\": [\n                        true,\n                        true,\n                        false,\n                        false,\n                        false\n                    ]\n                },\n                \"expectedValue\": 2\n            },\n            {\n                \"inputParameter\": {\n                    \"episodeSpongeBob\": [\n                        true,\n                        true,\n                        true,\n                        false,\n                        false\n                    ],\n                    \"episodeSquidward\": [\n                        false,\n                        false,\n                        false,\n                        true,\n                        true\n                    ]\n                },\n                \"expectedValue\": 0\n            },\n            {\n                \"inputParameter\": {\n                    \"episodeSpongeBob\": [\n                        false,\n                        false,\n                        false,\n                        false,\n                        false\n                    ],\n                    \"episodeSquidward\": [\n                        false,\n                        false,\n                        false,\n                        false,\n                        false\n                    ]\n                },\n                \"expectedValue\": 0\n            }\n        ],\n        \"implementation\": {\n            \"function\": \"function totalEpisode(episodeSpongeBob: boolean[], episodeSquidward: boolean[]): number {\\n  if (episodeSpongeBob.length !== episodeSquidward.length) {\\n    throw new Error(\\\"Panjang kedua array harus sama\\\");\\n  }\\n  let totalEpisodePersahabatan = 0;\\n  for (let i = 0; i < episodeSpongeBob.length; i++) {\\n    if (episodeSpongeBob[i] && episodeSquidward[i]) {\\n      totalEpisodePersahabatan++;\\n    }\\n  }\\n\\n  return totalEpisodePersahabatan;\\n}\",\n            \"language\": \"Typescript\",\n            \"functionName\": \"totalEpisode\"\n        }\n    }\n]`,
      },
    {
      role: "user",
      content: prompt,
    },
  ];

  return messages;
}
