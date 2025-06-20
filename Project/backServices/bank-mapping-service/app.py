from flask import Flask, request, send_file
from flask_cors import CORS
import pandas as pd
import io
import requests

app = Flask(__name__)

CORS(app)

bank_mappings = {
    "BankA": {"Date": "TransactionDate", "Merchant": "Merchant", "Amount": "Amount"},#Test banks
    "Monzo": {"Date": "TransactionDate", "Name": "Merchant", "Amount":"Amount","Category":"Category" },
    "Starling": {"Date": "TransactionDate", "Counter Party": "Merchant", "Amount (GBP)": "Amount", "Spending Category": "Category"}
}




def get_category(merchant_name):

    try:
        response = requests.get(f"http://transaction-service:8081/transactions/category/{merchant_name}")
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            category = response.text.strip()
            print(f"Category for {merchant_name}: {category}")
            return category
        else:
            # If there was an error  print the message
            print(f"Error: Received status code {response.status_code}. Response: {response.text}")
    except Exception as e:
        print(f"Error fetching category for {merchant_name}: {e}")


        #call backend api that will search every existing transaction with merchant name, and return most common category

@app.route('/map-bank-statement', methods=['POST'])
def map_bank_statement():

    #Thank God for panda
    bank_name = request.form.get('bank_name')
    csv_file = request.files.get('csv_file')


    csv_data = io.BytesIO(csv_file.read())
    dataFrame = pd.read_csv(csv_data)


    mapping = bank_mappings.get(bank_name)

    if mapping:

        dataFrame = dataFrame.rename(columns=mapping)  #Renames wanted columns as banks call them different names
        dataFrame = dataFrame[['TransactionDate', 'Merchant', 'Amount', 'Category']] #Filters out unwanted columns



        for index, row in dataFrame.iterrows():
            merchant_name = row['Merchant']
            category = get_category(merchant_name)
            dataFrame.at[index, 'Category'] = category


        dataFrame.loc[dataFrame['Amount'] > 0, 'Category'] = 'Income'  #Positive is categoried as Income
        dataFrame.loc[dataFrame['Amount'] < 0, 'Amount'] = dataFrame['Amount'].abs() #Negative is Turned to positive
        dataFrame['Amount'] = dataFrame['Amount'].apply(lambda x: "{:.2f}".format(x))  #Ensures 0's for pennies

        # Convert back to CSV format
        output = io.BytesIO()
        dataFrame.to_csv(output, index=False, header=False)  #Dont need header row
        output.seek(0)

        # Return the formatted csv
        return send_file(output, mimetype='text/csv', as_attachment=True, download_name='cleaned_transactions.csv')

    else:
        return {"error": "Mapping not found"}, 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
