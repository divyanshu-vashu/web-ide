/**
 * Python Library Examples
 * 
 * This file contains example code snippets for the supported Python libraries.
 * These can be used as templates for users to get started with the libraries.
 */

export interface PythonExample {
  name: string;
  description: string;
  code: string;
  library: string;
}

export const PYTHON_EXAMPLES: PythonExample[] = [
  // NumPy Examples
  {
    name: 'NumPy Basics',
    description: 'Basic array operations with NumPy',
    library: 'numpy',
    code: `# NumPy basics - array operations
import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4, 5])
b = np.array([6, 7, 8, 9, 10])

# Array operations
print("Array a:", a)
print("Array b:", b)
print("a + b:", a + b)
print("a * b:", a * b)
print("a squared:", a**2)

# Statistical operations
print("Mean of a:", np.mean(a))
print("Sum of b:", np.sum(b))
print("Standard deviation of a:", np.std(a))

# Generate a random array
random_array = np.random.rand(5)
print("Random array:", random_array)
`
  },
  {
    name: 'NumPy Matrix Operations',
    description: 'Matrix manipulations and linear algebra',
    library: 'numpy',
    code: `# NumPy matrix operations
import numpy as np

# Create matrices
A = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
B = np.array([[9, 8, 7], [6, 5, 4], [3, 2, 1]])

print("Matrix A:")
print(A)
print("Matrix B:")
print(B)

# Matrix operations
print("A + B:")
print(A + B)
print("A * B (element-wise):")
print(A * B)
print("A dot B (matrix multiplication):")
print(np.dot(A, B))

# Matrix properties
print("Determinant of A:", np.linalg.det(A))
print("Transpose of B:")
print(B.T)

# Solve linear equation: Ax = b
b = np.array([6, 15, 24])
print("Solving Ax = b:")
try:
    x = np.linalg.solve(A, b)
    print("Solution x:", x)
except np.linalg.LinAlgError:
    print("Matrix is singular, cannot solve")
`
  },
  // Pandas Examples
  {
    name: 'Pandas DataFrame Basics',
    description: 'Create and manipulate DataFrames in Pandas',
    library: 'pandas',
    code: `# Pandas DataFrame basics
import pandas as pd

# Create a simple DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eva'],
    'Age': [25, 30, 35, 40, 45],
    'City': ['New York', 'Paris', 'London', 'Tokyo', 'Berlin'],
    'Salary': [50000, 60000, 70000, 80000, 90000]
}

df = pd.DataFrame(data)
print("DataFrame:")
print(df)

# Basic information
print("\\nDataFrame info:")
print(df.info())
print("\\nDataFrame description:")
print(df.describe())

# Accessing data
print("\\nFirst 2 rows:")
print(df.head(2))
print("\\nLast 2 rows:")
print(df.tail(2))

# Filtering data
print("\\nFiltering: People older than 30")
print(df[df['Age'] > 30])

# Sorting
print("\\nSorted by Age (descending):")
print(df.sort_values('Age', ascending=False))

# Grouping and aggregation
print("\\nAverage salary by city:")
print(df.groupby('City')['Salary'].mean())
`
  },
  {
    name: 'Pandas Data Analysis',
    description: 'Data analysis and manipulation with Pandas',
    library: 'pandas',
    code: `# Pandas data analysis
import pandas as pd
import numpy as np

# Create a more complex DataFrame
np.random.seed(42)
dates = pd.date_range('20230101', periods=10)
df = pd.DataFrame({
    'Date': dates,
    'Value': np.random.randn(10),
    'Category': np.random.choice(['A', 'B', 'C'], 10),
    'Volume': np.random.randint(100, 1000, 10)
})

print("DataFrame:")
print(df)

# Data manipulation
df['Value_Squared'] = df['Value'] ** 2
df['Value_Category'] = df['Value'] * df['Category'].map({'A': 1, 'B': 2, 'C': 3})

print("\\nModified DataFrame:")
print(df)

# Time series operations
print("\\nValue by month:")
print(df.set_index('Date')['Value'].resample('M').mean())

# Pivot tables
print("\\nPivot table - average Value by Category:")
pivot = df.pivot_table(values='Value', index='Category', aggfunc='mean')
print(pivot)

# Data cleaning
# Add some missing values
df.loc[3:5, 'Value'] = np.nan
print("\\nDataFrame with missing values:")
print(df)

# Handle missing values
print("\\nDropping rows with missing values:")
print(df.dropna())
print("\\nFilling missing values with mean:")
print(df.fillna(df['Value'].mean()))
`
  },
  // Matplotlib Examples
  {
    name: 'Matplotlib Basic Plots',
    description: 'Create basic plots with Matplotlib',
    library: 'matplotlib',
    code: `# Matplotlib basic plots
import matplotlib.pyplot as plt
import numpy as np

# Generate data
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Create a figure with subplots
plt.figure(figsize=(10, 6))

# Plot 1: Line Plot
plt.subplot(2, 2, 1)
plt.plot(x, y1, 'b-', label='sin(x)')
plt.plot(x, y2, 'r--', label='cos(x)')
plt.title('Line Plot')
plt.legend()

# Plot 2: Scatter Plot
plt.subplot(2, 2, 2)
plt.scatter(x[::5], y1[::5], c='blue', alpha=0.5, label='sin(x)')
plt.scatter(x[::5], y2[::5], c='red', alpha=0.5, label='cos(x)')
plt.title('Scatter Plot')
plt.legend()

# Plot 3: Bar Chart
plt.subplot(2, 2, 3)
categories = ['A', 'B', 'C', 'D', 'E']
values = np.random.rand(5) * 10
plt.bar(categories, values)
plt.title('Bar Chart')

# Plot 4: Histogram
plt.subplot(2, 2, 4)
data = np.random.randn(1000)
plt.hist(data, bins=30, alpha=0.7, color='green')
plt.title('Histogram')

plt.tight_layout()
# No need to call plt.show() as our custom show_plot() function will be used
`
  },
  {
    name: 'Matplotlib Advanced Visualization',
    description: 'Create advanced visualizations with Matplotlib',
    library: 'matplotlib',
    code: `# Matplotlib advanced visualization
import matplotlib.pyplot as plt
import numpy as np

# 3D Plot
from mpl_toolkits.mplot3d import Axes3D

# Generate data for 3D plot
theta = np.linspace(-4 * np.pi, 4 * np.pi, 100)
z = np.linspace(-2, 2, 100)
r = z**2 + 1
x = r * np.sin(theta)
y = r * np.cos(theta)

fig = plt.figure(figsize=(12, 10))

# 3D line plot
ax = fig.add_subplot(2, 2, 1, projection='3d')
ax.plot(x, y, z, label='3D parametric curve')
ax.set_title('3D Line Plot')
ax.legend()

# Contour plot
ax = fig.add_subplot(2, 2, 2)
x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)
contour = ax.contourf(X, Y, Z, cmap='viridis')
plt.colorbar(contour, ax=ax)
ax.set_title('Contour Plot')

# Heatmap
ax = fig.add_subplot(2, 2, 3)
data = np.random.rand(10, 10)
heatmap = ax.imshow(data, cmap='plasma')
plt.colorbar(heatmap, ax=ax)
ax.set_title('Heatmap')

# Pie chart
ax = fig.add_subplot(2, 2, 4)
labels = ['A', 'B', 'C', 'D', 'E']
sizes = [15, 30, 45, 10, 25]
ax.pie(sizes, labels=labels, autopct='%1.1f%%', shadow=True, startangle=90)
ax.axis('equal')
ax.set_title('Pie Chart')

plt.tight_layout()
# No need to call plt.show() as our custom show_plot() function will be used
`
  },
  // Scikit-learn Examples
  {
    name: 'Scikit-learn Basics',
    description: 'Basic machine learning with Scikit-learn',
    library: 'scikit-learn',
    code: `# Scikit-learn basics
import numpy as np
from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# Load a dataset (iris)
iris = datasets.load_iris()
X = iris.data
y = iris.target

print("Dataset shape:", X.shape)
print("First few samples:")
for i in range(3):
    print(f"Sample {i}: {X[i]}, Class: {y[i]} ({iris.target_names[y[i]]})")

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
print("\\nTraining set shape:", X_train.shape)
print("Test set shape:", X_test.shape)

# Standardize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train a model
model = LogisticRegression(max_iter=200)
model.fit(X_train_scaled, y_train)

# Make predictions
y_pred = model.predict(X_test_scaled)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print("\\nAccuracy:", accuracy)
print("\\nClassification report:")
print(classification_report(y_test, y_pred, target_names=iris.target_names))
`
  },
  // Combined Example
  {
    name: 'Data Science Workflow',
    description: 'Complete data science workflow with multiple libraries',
    library: 'all',
    code: `# Complete data science workflow
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix

# Generate synthetic data
X, y = make_classification(n_samples=1000, n_features=10, n_informative=5, 
                          n_redundant=3, random_state=42)

# Create a DataFrame
feature_names = [f'feature_{i}' for i in range(X.shape[1])]
df = pd.DataFrame(X, columns=feature_names)
df['target'] = y

print("Dataset preview:")
print(df.head())

# Data analysis
print("\\nDataset statistics:")
print(df.describe())

print("\\nCorrelation with target:")
correlations = df.corrwith(df['target']).sort_values(ascending=False)
print(correlations)

# Visualization
plt.figure(figsize=(12, 10))

# Plot correlation heatmap
plt.subplot(2, 2, 1)
correlation_matrix = df.corr()
plt.imshow(correlation_matrix, cmap='coolwarm')
plt.colorbar()
plt.title('Correlation Heatmap')
plt.xticks(range(len(correlation_matrix.columns)), correlation_matrix.columns, rotation=90)
plt.yticks(range(len(correlation_matrix.columns)), correlation_matrix.columns)

# Plot feature distributions by class
plt.subplot(2, 2, 2)
for class_value in [0, 1]:
    subset = df[df['target'] == class_value]
    plt.hist(subset['feature_0'], alpha=0.5, label=f'Class {class_value}')
plt.legend()
plt.title('Feature Distribution by Class')

# Scatter plot of two important features
plt.subplot(2, 2, 3)
for class_value in [0, 1]:
    subset = df[df['target'] == class_value]
    plt.scatter(subset['feature_0'], subset['feature_1'], 
               alpha=0.5, label=f'Class {class_value}')
plt.legend()
plt.xlabel('Feature 0')
plt.ylabel('Feature 1')
plt.title('Feature Scatter Plot')

# Machine learning
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("\\nModel accuracy:", accuracy)

# Plot feature importance
plt.subplot(2, 2, 4)
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
plt.bar(range(X.shape[1]), importances[indices])
plt.xticks(range(X.shape[1]), [feature_names[i] for i in indices], rotation=90)
plt.title('Feature Importance')

plt.tight_layout()
# No need to call plt.show() as our custom show_plot() function will be used
`
  }
];

// Function to get examples for a specific library
export function getExamplesForLibrary(library: string): PythonExample[] {
  if (library === 'all') {
    return PYTHON_EXAMPLES;
  }
  return PYTHON_EXAMPLES.filter(example => 
    example.library === library || example.library === 'all'
  );
} 