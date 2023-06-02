
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, updateDoc, deleteDoc, doc, writeBatch ,orderBy ,where} from 'firebase/firestore';

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration


const firebaseConfig = {
  apiKey: "AIzaSyDzl7gf5RpZxjTE_PXEm29SBtlETz12ZD4",
  authDomain: "web2-teste.firebaseapp.com",
  databaseURL: "https://web2-teste-default-rtdb.firebaseio.com",
  projectId: "web2-teste",
  storageBucket: "web2-teste.appspot.com",
  messagingSenderId: "405409511078",
  appId: "1:405409511078:web:4b373465db282d6dc56667"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para criar registros em lote
async function createRecords(numRecords) {
    const batchSize = 500;
    const totalBatches = Math.ceil(numRecords / batchSize);
    const citiesCol = collection(db, 'usuarios');
    const startTime = performance.now();
  
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batch = writeBatch(db);
      const batchStartIndex = batchIndex * batchSize;
      const batchEndIndex = Math.min(batchStartIndex + batchSize, numRecords);
  
      for (let i = batchStartIndex; i < batchEndIndex; i++) {
        const newCity = {
          id: '' + i,
          name: '32322',
          idade: 20,
          email: 'murillo@gmail.com',
        };
  
        const documentRef = doc(citiesCol);
        batch.set(documentRef, newCity);
      }
  
      await batch.commit();
    }
  
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log(`Inseridos ${numRecords} registros.`);
    console.log('Tempo de resposta:', elapsedTime, 'ms');
  }
  
  
// Função para ler registros em lote
async function readRecords(batchSize) {
    try {
      console.log('Iniciando consulta...');
      const collectionRef = collection(db, 'usuarios');
      const queryRef = query(collectionRef);
      const startTime = performance.now();
      const querySnapshot = await getDocs(queryRef);
      const endTime = performance.now();
      querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
  

      const elapsedTime = endTime - startTime;
      console.log(`Consulta concluída. Tempo de resposta: ${elapsedTime} ms`);
    } catch (error) {
      console.error('Erro ao ler os registros:', error);
    }
  }
  
  async function readRecordsMaiorQue20() {
    try {
      console.log('Iniciando consulta...');
      const collectionRef = collection(db, 'usuarios');
      const queryRef = query(collectionRef, where('idade', '>', 20));
      const startTime = performance.now();
      const querySnapshot = await getDocs(queryRef);
      const endTime = performance.now();
      querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
  
      const elapsedTime = endTime - startTime;
      console.log(`Consulta concluída. Tempo de resposta: ${elapsedTime} ms`);
    } catch (error) {
      console.error('Erro ao ler os registros:', error);
    }
  }
  
// Função para atualizar um registro
async function updateNamesByAge(age, newName) {
    try {
      const startTime = performance.now();
      const citiesCol = collection(db, 'usuarios');
      const querySnapshot = await getDocs(query(citiesCol, where('idade', '==', age)));
  
      const documentsToUpdate = [];
  
      querySnapshot.forEach((doc) => {
        documentsToUpdate.push(doc.ref);
      });
  
      const batchSize = 500;
      const totalBatches = Math.ceil(documentsToUpdate.length / batchSize);
  
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStartIndex = batchIndex * batchSize;
        const batchEndIndex = Math.min(batchStartIndex + batchSize, documentsToUpdate.length);
        const batch = writeBatch(db);
  
        for (let i = batchStartIndex; i < batchEndIndex; i++) {
          batch.update(documentsToUpdate[i], { name: newName });
        }
  
        const batchStartTime = performance.now();
        await batch.commit();
        const batchEndTime = performance.now();
        const batchElapsedTime = batchEndTime - batchStartTime;
        console.log(`Tempo de execução do lote ${batchIndex + 1}:`, batchElapsedTime, 'ms');
      }
  
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      console.log('Tempo total da requisição:', elapsedTime, 'ms');
      console.log('Nomes atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar os nomes:', error);
    }
  }
async function deleteAllDocuments(collectionName, batchSize) {
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
  
      const totalDocuments = querySnapshot.size;
      const totalBatches = Math.ceil(totalDocuments / batchSize);
      let totalTime = 0;
  
      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStartIndex = batchIndex * batchSize;
        const batchEndIndex = Math.min(batchStartIndex + batchSize, totalDocuments);
        const batchDocuments = batchEndIndex - batchStartIndex;
  
        const startTime = performance.now();
        const documentsToDelete = querySnapshot.docs.slice(batchStartIndex, batchEndIndex).map((doc) => doc.ref);
        const batch = writeBatch(db);
  
        documentsToDelete.forEach((docRef) => {
          batch.delete(docRef);
        });
  
        await batch.commit();
  
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        totalTime += elapsedTime;
  
        console.log(`Lote ${batchIndex + 1}: Excluídos ${batchDocuments} documentos. Tempo de processamento: ${elapsedTime} ms`);
      }
  
      console.log(`Todos os ${totalDocuments} documentos foram excluídos com sucesso!`);
      console.log(`Tempo de processamento total: ${totalTime} ms`);
    } catch (error) {
      console.error('Erro ao excluir os documentos:', error);
    }
  }
  
  async function readRecordsINDICE() {
    try {
      console.log('Iniciando consulta...');
  
      const startTime = performance.now();
  
      const collectionRef = collection(db, 'usuarios');
      const queryRef = query(collectionRef, orderBy('age')); // Aqui, 'name' é o campo pelo qual você criou o índice
  
      const querySnapshot = await getDocs(queryRef);
  
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
  
      querySnapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data());
      });
  
      console.log('Tempo de resposta:', elapsedTime, 'ms');
  
    } catch (error) {
      console.error('Erro ao ler os registros:', error);
    }
  }

async function deleteDocumentsByCriteria(collectionName, field, value) {
  try {
    const collectionRef = collection(db, collectionName);
    const queryRef = query(collectionRef, where(field, '>', value));

    const querySnapshot = await getDocs(queryRef);
    const startTime = performance.now();
    const promises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(promises);

    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log('Documentos excluídos com sucesso! '+elapsedTime +"ms");
  } catch (error) {
    console.error('Erro ao excluir os documentos:', error);
  }
}




async function updateDocumentsByCriteria(collectionName, field, value, updateData) {
  try {
    const collectionRef = collection(db, collectionName);
    const queryRef = query(collectionRef, where(field, '>', value));

    const querySnapshot = await getDocs(queryRef);

    const promises = querySnapshot.docs.map((doc) => updateDoc(doc.ref, updateData));
    await Promise.all(promises);

    console.log('Documentos atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar os documentos:', error);
  }
}

async function deleteRecordsMaior20() {
  try {
    const collectionRef = collection(db, 'usuarios');
    const queryRef = query(collectionRef, where('idade', '==', "40"));
    const querySnapshot = await getDocs(queryRef);

    const startTime = performance.now(); // Tempo de início da operação

    const deletePromises = querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref);
      console.log('Documento excluído:', doc.id);
    });

    await Promise.all(deletePromises);

    const endTime = performance.now(); // Tempo de fim da operação
    const elapsedTime = endTime - startTime; // Tempo total de execução

    console.log('Registros excluídos com sucesso!');
    console.log('Tempo total de execução:', elapsedTime, 'ms');
  } catch (error) {
    console.error('Erro ao excluir registros:', error);
  }
}

async function updateRecords20() {
  try {
    const collectionRef = collection(db, 'usuarios');
    const queryRef = query(collectionRef, where('idade', '==', "15"));
    const querySnapshot = await getDocs(queryRef);

    const updatePromises = querySnapshot.docs.map((doc) => {
      const startTime = performance.now();
      const updatePromise = updateDoc(doc.ref, { idade: "40" });
      const endTime = performance.now();

      return updatePromise.then(() => {
        const elapsedTime = endTime - startTime;
        console.log('Documento atualizado:', doc.id, 'Tempo:', elapsedTime, 'ms');
        return elapsedTime; // Retornar o tempo individual da atualização
      });
    });

    const individualTimes = await Promise.all(updatePromises);
    const totalTime = individualTimes.reduce((sum, time) => sum + time, 0);

    console.log('Registros atualizados com sucesso!');
    console.log('Tempo total:', totalTime, 'ms');
  } catch (error) {
    console.error('Erro ao atualizar registros:', error);
  }
}
async function readRecords15() {
  try {
    const collectionRef = collection(db, 'usuarios');
    const queryRef = query(collectionRef, where('idade', '==', "40"),orderBy("idade","desc"));
    const querySnapshot = await getDocs(queryRef);

    let totalTime = 0; // Variável para acumular o tempo total das leituras

    querySnapshot.forEach((doc) => {
      const startTime = performance.now();

      console.log(doc.id, '=>', doc.data());

      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      console.log('Documento lido:', doc.id, 'Tempo:', elapsedTime, 'ms');

      totalTime += elapsedTime; // Adiciona o tempo da leitura à soma total
    });

    console.log('Leitura de registros concluída!');
    console.log('Tempo total:', totalTime, 'ms');
  } catch (error) {
    console.error('Erro ao ler registros:', error);
  }
} 

// Função para encontrar usuários
async function findUsers() {
  try {
    // Referencie o Firestore
    const db = getFirestore();

    // Crie a consulta
    const usersRef = collection(db, 'usuarios');
    const queryRef = query(usersRef, where('idade', '!=', '20'), orderBy('idade', 'desc'));

    // Execute a consulta   
     const startTime = performance.now();

    const snapshot = await getDocs(queryRef);
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    console.log('Documento lido:'+ elapsedTime, 'ms');

    // Mapeie os dados dos documentos retornados
    const users = snapshot.docs.map(doc => doc.data());

    // Faça o que você precisa com os dados dos usuários
    console.log(users);
  } catch (error) {
    console.error('Erro ao encontrar usuários:', error);
  }
}

readRecords15() 