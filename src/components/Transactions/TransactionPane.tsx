import { useState, useEffect } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved);

  console.log("TransactionPane props:", transaction, loading);

  useEffect(() => {
    const storageValue = localStorage.getItem(`transaction-${transaction.id}`);
    if (storageValue !== null) {
      setApproved(JSON.parse(storageValue));
    }
  }, [transaction]);

  const handleApprovalChange = async (newValue: boolean) => {
    try {
      await setTransactionApproval({ transactionId: transaction.id, newValue });
      setApproved(newValue);
      localStorage.setItem(`transaction-${transaction.id}`, JSON.stringify(newValue));
      console.log(`Stored new value ${newValue} in local storage for transaction ${transaction.id}`);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={handleApprovalChange}
      />
    </div>
  )
}


const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
