var app = new Vue({
    el: '#app',
    data: {
        name: '',
        submited: true,
        mulai: false,
        selesai: false,
        symtoms: [0, 0, 0, 0, 0, 0, 0, 0],
        visible: {
            0: true,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false
        },
        bobot: [0.6, 0.2, 0.6, 0.4, 0.4, 0.2, 0.2, 0.8],
        cfCombine: 0,
        diagnostic: '',
        home: true,
        method: '', // 'forward' atau 'backward'
        questions: [
            '', // Indeks 0 tidak digunakan
            'Apakah Anda sering mengalami rasa takut secara tiba-tiba?',
            'Apakah Anda sering mendengar suara atau melihat sesuatu yang tidak nyata?',
            'Apakah Anda sering berbicara dengan cara yang tidak teratur atau sulit dipahami oleh orang lain?',
            'Apakah Anda kehilangan minat atau kesenangan dalam melakukan aktivitas yang sebelumnya disukai?',
            'Apakah Anda pernah mengalami perasaan bahwa dunia di sekitar Anda tidak nyata atau berbeda dari biasanya?',
            'Apakah Anda sering mendengar suara atau melihat sesuatu yang tidak nyata?',
            'Apakah Anda merasa orang lain berusaha menyakiti atau memata-matai Anda tanpa alasan yang jelas?'
        ],
        diseases: {
            anxiety: [1, 4, 5], // Gejala yang relevan dengan Anxiety
            panicDisorder: [1, 5, 7], // Gejala yang relevan dengan Panic Disorder
            bipolar: [2, 3, 6], // Gejala yang relevan dengan Bipolar
            skizofrenia: [2, 3, 6, 7] // Gejala yang relevan dengan Skizofrenia
        },
        currentDisease: '', // Penyakit yang sedang diperiksa
        currentSymptomIndex: 0, // Indeks gejala yang sedang diperiksa
    },
    methods: {
        goHome: function () {
            this.home = true;
            this.method = '';
            this.visible = { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
            this.selesai = false;
        },
        inputName: function () {
            if (this.name !== '') {
                this.submited = false;
                this.mulai = true;
                this.visible[0] = true;
            } else {
                swal({
                    title: "Oops!",
                    text: "Anda harus memasukkan nama Anda",
                    icon: "warning"
                });
            }
        },
        setMethod: function (method) {
            this.method = method;
            this.home = false;
            this.visible = { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
            this.symtoms = [0, 0, 0, 0, 0, 0, 0, 0];
            this.selesai = false;
        },
        inputWeight: function (index, nilai, method) {
            if (method === 'backward') {
                if (index === 0) { // Jika memilih penyakit
                    this.currentDisease = Object.keys(this.diseases)[nilai];
                    this.currentSymptomIndex = 0;
                    this.visible = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
                    this.showNextSymptom();
                } else { // Jika menjawab gejala
                    this.symtoms[index - 1] = nilai;
                    this.currentSymptomIndex++;
                    this.showNextSymptom();
                }
            } else {
                // Logika Forward Chaining (yang sudah ada)
                this.symtoms[index - 1] = nilai;
                this.visible[index] = false;
                if (index !== 7) {
                    this.visible[index + 1] = true;
                } else if (index === 7) {
                    this.selesai = true;
                    this.mulai = false;
                    this.diagnosa(method);
                }
            }
        },
        diagnosa: function (method) {
            this.cfCombine = 0;
            let cf = [];

            for (let i = 0; i < this.bobot.length; i++) {
                cf[i] = this.bobot[i] * this.symtoms[i];
                if (i === 0) {
                    this.cfCombine = cf[i];
                } else {
                    this.cfCombine = this.cfCombine + cf[i] * (1 - this.cfCombine);
                }
            }

            this.cfCombine = Math.round(this.cfCombine * 10000) / 100;

            if (this.cfCombine >= 0 && this.cfCombine <= 50) {
                this.diagnostic = 'KEMUNGKINAN yang KECIL';
            } else if (this.cfCombine > 50 && this.cfCombine <= 79) {
                this.diagnostic = 'KEMUNGKINAN';
            } else if (this.cfCombine > 79 && this.cfCombine <= 99) {
                this.diagnostic = 'KEMUNGKINAN YANG BESAR';
            } else {
                this.diagnostic = 'SANGAT YAKIN';
            }
        },
        showNextSymptom: function () {
            if (this.currentDisease && this.currentSymptomIndex < this.diseases[this.currentDisease].length) {
                let symptomIndex = this.diseases[this.currentDisease][this.currentSymptomIndex];
                this.visible = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
                this.visible[symptomIndex] = true;
            } else {
                this.selesai = true;
                this.diagnosa('backward');
            }
        },
        init: function () {
            this.name = '';
            this.submited = true;
            this.mulai = false;
            this.selesai = false;
            this.symtoms = [0, 0, 0, 0, 0, 0, 0, 0];
            this.visible = { 0: true, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
            this.diagnostic = '';
            this.cfCombine = 0;
            this.home = true;
            this.method = '';
        },
        goAbout: function () {
            this.home = false;
            this.about = true;
            this.info = false;
        },
        goInfo: function () {
            this.home = false;
            this.about = false;
            this.info = true;
        },
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sispakv2/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successfully with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}