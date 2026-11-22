const API_URL = "http://localhost:5234";


// ==============================
// BAŞVURULARI LİSTELE + DASHBOARD
// ==============================

async function loadApplications() {

    const response = await fetch(`${API_URL}/api/applications`);

    const applications = await response.json();


    // Dashboard istatistikleri

    document.getElementById("totalApplications").textContent =
        applications.length;

    document.getElementById("appliedApplications").textContent =
        applications.filter(a => a.status === "Applied").length;

    document.getElementById("interviewApplications").textContent =
        applications.filter(a => a.status === "Interview").length;

    document.getElementById("acceptedApplications").textContent =
        applications.filter(a => a.status === "Accepted").length;

    document.getElementById("rejectedApplications").textContent =
        applications.filter(a => a.status === "Rejected").length;


    // Başvuru listesini oluştur

    const container = document.getElementById("applications");

    container.innerHTML = "";


    applications.forEach(application => {

        const card = document.createElement("div");

        card.className = "application-card";


        card.innerHTML = `
            <h3>${application.position}</h3>

            <p>
                <strong>Şirket:</strong>
                ${application.company.name}
            </p>

            <p>
                <strong>Tür:</strong>
                ${application.applicationType}
            </p>

            <p>
                <strong>Tarih:</strong>
                ${application.applicationDate.substring(0, 10)}
            </p>

            <span class="status">
                ${application.status}
            </span>

            <br>

            <button
                class="delete-button"
                onclick="deleteApplication(${application.id})">
                Sil
            </button>

            <button
                class="edit-button"
                onclick="editApplication(${application.id})">
                Düzenle
            </button>
        `;


        container.appendChild(card);

    });
}



// ==============================
// YENİ BAŞVURU EKLE
// ==============================

document
    .getElementById("applicationForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const companyName = document
            .getElementById("companyName")
            .value
            .trim();

        const position = document
            .getElementById("position")
            .value
            .trim();

        const applicationType = document
            .getElementById("applicationType")
            .value;

        const status = document
            .getElementById("status")
            .value;

        const applicationDate = document
            .getElementById("applicationDate")
            .value;

        const jobUrl = document
            .getElementById("jobUrl")
            .value
            .trim();

        const notes = document
            .getElementById("notes")
            .value
            .trim();


        // Şirketleri getir

        const companiesResponse = await fetch(
            `${API_URL}/api/companies`
        );

        const companies = await companiesResponse.json();


        // Şirket daha önce var mı?

        let company = companies.find(
            c => c.name.toLowerCase() === companyName.toLowerCase()
        );


        // Yoksa yeni şirket oluştur

        if (!company) {

            const createCompanyResponse = await fetch(
                `${API_URL}/api/companies`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: companyName
                    })
                }
            );

            company = await createCompanyResponse.json();
        }


        // Başvuruyu oluştur

        const response = await fetch(
            `${API_URL}/api/applications`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    companyId: company.id,
                    position: position,
                    applicationType: applicationType,
                    status: status,
                    applicationDate: applicationDate,
                    jobUrl: jobUrl || null,
                    notes: notes || null
                })
            }
        );


        if (!response.ok) {

            alert("Başvuru kaydedilemedi!");

            return;
        }


        alert("Başvuru başarıyla kaydedildi!");


        // Formu temizle

        document
            .getElementById("applicationForm")
            .reset();


        // Listeyi ve dashboard'u yenile

        loadApplications();

    });



// ==============================
// BAŞVURU SİL
// ==============================

async function deleteApplication(id) {

    const confirmed = confirm(
        "Bu başvuruyu silmek istediğine emin misin?"
    );


    if (!confirmed) {
        return;
    }


    const response = await fetch(
        `${API_URL}/api/applications/${id}`,
        {
            method: "DELETE"
        }
    );


    if (!response.ok) {

        alert("Başvuru silinemedi!");

        return;
    }


    alert("Başvuru silindi!");


    loadApplications();
}



// ==============================
// DÜZENLEME FORMUNU AÇ
// ==============================

async function editApplication(id) {

    const response = await fetch(
        `${API_URL}/api/applications`
    );


    const applications = await response.json();


    const application = applications.find(
        a => a.id === id
    );


    if (!application) {

        alert("Başvuru bulunamadı!");

        return;
    }


    // Düzenleme formunu göster

    document
        .getElementById("editSection")
        .style.display = "block";


    // Bilgileri forma doldur

    document
        .getElementById("editId")
        .value = application.id;


    document
        .getElementById("editPosition")
        .value = application.position;


    document
        .getElementById("editApplicationType")
        .value = application.applicationType;


    document
        .getElementById("editStatus")
        .value = application.status;


    document
        .getElementById("editApplicationDate")
        .value =
        application.applicationDate.substring(0, 10);


    document
        .getElementById("editJobUrl")
        .value =
        application.jobUrl || "";


    document
        .getElementById("editNotes")
        .value =
        application.notes || "";


    // Company ID'yi sakla

    document
        .getElementById("editForm")
        .dataset.companyId =
        application.companyId;
}



// ==============================
// DÜZENLEMEYİ KAYDET
// ==============================

document
    .getElementById("editForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const id =
            document.getElementById("editId").value;


        const companyId =
            this.dataset.companyId;


        const updatedApplication = {

            companyId: parseInt(companyId),

            position:
                document.getElementById("editPosition").value,

            applicationType:
                document.getElementById("editApplicationType").value,

            status:
                document.getElementById("editStatus").value,

            applicationDate:
                document.getElementById("editApplicationDate").value,

            jobUrl:
                document.getElementById("editJobUrl").value || null,

            notes:
                document.getElementById("editNotes").value || null
        };


        const response = await fetch(
            `${API_URL}/api/applications/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedApplication)
            }
        );


        if (!response.ok) {

            alert("Başvuru güncellenemedi!");

            return;
        }


        alert("Başvuru başarıyla güncellendi!");


        document
            .getElementById("editSection")
            .style.display = "none";


        // Listeyi ve dashboard'u yenile

        loadApplications();

    });



// ==============================
// UYGULAMAYI BAŞLAT
// ==============================

loadApplications();