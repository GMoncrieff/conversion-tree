class TreeEngine {
    constructor(treeType, dataPath) {
        this.treeType = treeType;
        this.dataPath = dataPath;
        this.treeData = null;
        this.currentNode = null;
        this.history = [];
        this.path = [];
        this.container = null;
        this.backBtn = null;
    }

    async init() {
        console.log('TreeEngine init called for:', this.treeType);
        
        this.container = document.getElementById('tree-container');
        this.backBtn = document.getElementById('back-btn');
        
        console.log('Container found:', this.container);
        console.log('Back button found:', this.backBtn);
        
        if (!this.container) {
            console.error('tree-container element not found!');
            return;
        }
        
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => this.goBack());
        }

        // Load tree data
        try {
            console.log('Fetching data from:', this.dataPath);
            const response = await fetch(this.dataPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.treeData = await response.json();
            console.log('Tree data loaded:', this.treeData);
            
            // Get root node
            const rootKey = Object.keys(this.treeData)[0];
            console.log('Root key:', rootKey);
            this.currentNode = this.treeData[rootKey];
            console.log('Current node:', this.currentNode);
            
            this.render();
        } catch (error) {
            console.error('Error loading tree data:', error);
            if (this.container) {
                this.container.innerHTML = '<p class="error">Error loading assessment data. Please try again. Error: ' + error.message + '</p>';
            }
        }
    }

    render() {
        this.container.innerHTML = '';
        
        if (this.currentNode.question) {
            this.renderQuestion();
        } else if (this.currentNode.outcome) {
            this.handleOutcome();
        }

        // Show/hide back button
        if (this.backBtn) {
            this.backBtn.style.display = this.history.length > 0 ? 'inline-block' : 'none';
        }
    }

    renderQuestion() {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        
        const questionText = document.createElement('h2');
        questionText.className = 'question-text';
        questionText.textContent = this.currentNode.question;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        
        const yesBtn = document.createElement('button');
        yesBtn.className = 'btn btn-primary';
        yesBtn.textContent = 'Yes';
        yesBtn.addEventListener('click', () => this.handleAnswer('yes'));
        
        const noBtn = document.createElement('button');
        noBtn.className = 'btn btn-primary';
        noBtn.textContent = 'No';
        noBtn.addEventListener('click', () => this.handleAnswer('no'));
        
        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        
        questionCard.appendChild(questionText);
        questionCard.appendChild(buttonContainer);
        
        this.container.appendChild(questionCard);
    }

    handleAnswer(answer) {
        // Save current state to history
        this.history.push({
            node: this.currentNode,
            path: [...this.path]
        });
        
        // Add to path
        this.path.push({
            question: this.currentNode.question,
            answer: answer
        });
        
        // Move to next node
        if (answer === 'yes' && this.currentNode.yes) {
            this.currentNode = this.currentNode.yes;
        } else if (answer === 'no' && this.currentNode.no) {
            this.currentNode = this.currentNode.no;
        } else {
            console.error('Invalid answer or missing node');
            return;
        }
        
        this.render();
    }

    goBack() {
        if (this.history.length === 0) return;
        
        const previousState = this.history.pop();
        this.currentNode = previousState.node;
        this.path = previousState.path;
        
        this.render();
    }

    handleOutcome() {
        const outcome = this.currentNode.outcome;
        
        // Add outcome to path
        this.path.push({
            outcome: outcome.id
        });
        
        // Save result and path to sessionStorage
        sessionStorage.setItem(`${this.treeType}Result`, outcome.id);
        sessionStorage.setItem(`${this.treeType}Path`, JSON.stringify(this.path));
        
        // Redirect to result page
        window.location.href = `result.html?tree=${this.treeType}&id=${outcome.id}`;
    }
}
