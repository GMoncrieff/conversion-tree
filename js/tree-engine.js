class TreeEngine {
    constructor(containerId, dataPath, treeType) {
        this.containerId = containerId;
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
        
        this.container = document.getElementById(this.containerId);
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
        
        // Get all possible answer keys from the current node (excluding 'question')
        const answerKeys = Object.keys(this.currentNode).filter(key => key !== 'question');
        
        // Create a button for each answer option
        answerKeys.forEach(answerKey => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            // Capitalize first letter and format the button text
            btn.textContent = answerKey.charAt(0).toUpperCase() + answerKey.slice(1).replace(/\//g, ' / ');
            btn.addEventListener('click', () => this.handleAnswer(answerKey));
            buttonContainer.appendChild(btn);
        });
        
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
        
        // Move to next node using the answer as the key
        if (this.currentNode[answer]) {
            this.currentNode = this.currentNode[answer];
        } else {
            console.error('Invalid answer or missing node:', answer);
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
        
        // Handle routing based on tree type and outcome
        if (this.treeType === 'pathway') {
            // P1, P2, P4, P5 go directly to recommendations
            // P3 shows result page then continues to demand assessment
            if (outcome.id === 'P3') {
                window.location.href = `result.html?tree=${this.treeType}&id=${outcome.id}`;
            } else {
                // Skip demand and vulnerability, go straight to recommendations
                window.location.href = 'recommendation.html';
            }
        } else {
            // Normal flow for demand and vulnerability trees
            window.location.href = `result.html?tree=${this.treeType}&id=${outcome.id}`;
        }
    }
}
