from flask import Flask, request, send_file
import pandas as pd
import io

app = Flask(__name__)


bank_mappings = {
    "BankA": {"Date": "TransactionDate", "Merchant": "Merchant", "Amount": "Amount"},
    "BankB": {"TransDate": "TransactionDate", "Vendor": "Merchant", "Amount": "Amount"},
    "Starling": {"Date": "TransactionDate", "Counter Party": "Merchant", "Amount (GBP)": "Amount"}
}


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
        dataFrame = dataFrame[['TransactionDate', 'Merchant', 'Amount']] #Filters out unwanted columns

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
