const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./path-to-service-account-key.json")),
});

const db = admin.firestore();

async function backfillPatronIds() {
  try {
    const patronsSnapshot = await db.collection("patrons").get();
    const salariesSnapshot = await db.collection("salaries").get();

    const salaries = {};
    salariesSnapshot.forEach((doc) => {
      const data = doc.data();
      salaries[data.patronId] = { id: doc.id, ...data }; // Map salaries by patronId
    });

    const batch = db.batch(); // Batch updates to reduce network calls

    patronsSnapshot.forEach((doc) => {
      const patronData = doc.data();

      // Use the Firestore document ID as the patronId
      const patronId = doc.id;

      // Update the patron document with the patronId
      batch.update(db.collection("patrons").doc(doc.id), { patronId });

      // Find the corresponding salary document and update its patronId
      const salaryDoc = Object.values(salaries).find(
        (salary) => salary.name === patronData.fullName
      );
      if (salaryDoc) {
        batch.update(db.collection("salaries").doc(salaryDoc.id), { patronId });
      } else {
        console.warn(`No matching salary record found for patron: ${patronData.fullName}`);
      }
    });

    // Commit the batch
    await batch.commit();
    console.log("Backfill completed successfully!");
  } catch (error) {
    console.error("Error during backfill:", error);
  }
}

backfillPatronIds();
