import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table } from "antd";
import { EditOutlined, DeleteOutlined, UnderlineOutlined, AreaChartOutlined } from "@ant-design/icons/lib/icons";import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTransactions } from "../Context/Context";
import Spinner from "../Spinner/Spinner";
import './Budget.css';
import axios from "axios";
import { getDecodedToken } from "../utils/utils";
import ChartBudget from "../Charts/ChartBudget";


const Budget = () => {
  const [showBudget, setShowBudget] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [allBudget, setAllBudget] = useState([]);
  const [editBudget, setEditBudget] = useState(null)
  const [viewBudget, setViewBudget] = useState('formBudget')
  const { allBudget, setAllBudget, allTransactions } = useTransactions();


//getall transactions. useffect is used
const getAllBudget = async () => {
    try {
        const decodedToken = getDecodedToken(); // Use the utility function
        let userid;
        if (decodedToken) {
            userid = decodedToken._id;
            console.log("User ID:", userid);
        }
        
        setLoading(true);
        
        const res = await axios.post('/api/budget/get-budget', { userid: userid }); //DO NOT FORGET TO ADD /api/ 
        
        setLoading(false);
        
        setAllBudget(res.data);
        console.log(res.data);
        console.log(allBudget)
        
    } catch (error) {
        setLoading(false);
        console.log(error);
    }
}


const getAggregatedBudget = (budgets) => {
  let aggregated = {
    amount: 0,
    categories: {
      food: 0,
      bills: 0,
      travelling: 0,
     
      misc: 0,
      //... Add more categories if needed ...
    }
  };
  
  budgets.forEach(budget => {
    aggregated.amount += budget.amount;
    for (let category in budget.categories) {
      aggregated.categories[category] += budget.categories[category];
    }
  });
  
  return aggregated;
};
//useEffect Hook. to call the above
useEffect(() => {
     getAllBudget();
     console.log("All Budgets:", allBudget);
}, [] )

  //table data
  const columns = [
    {
        title: "amount",
        dataIndex: "amount",
    },
    {
        title: "Food Budget",
        dataIndex: ["categories", "food"],
    },
    {
        title: "Bills Budget",
        dataIndex: ["categories", "bills"],
    },
    {
        title: "Travelling Budget",
        dataIndex: ["categories", "travelling"],
    },

    {
      title: "Medical Budget",
      dataIndex: ["categories", "medical"],
  },
    {
        title: "Misc Budget",
        dataIndex: ["categories", "misc"],
    },

    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <i className="bi bi-pencil-square text-success m-2 bigger-icon" onClick={() => { 
            
            setEditBudget(record)
            setShowBudget(true); //when clicking on edit, the modal/form should be prefilled with the record.
          }}/>
          <i class="bi bi-trash3-fill text-danger m-2 bigger-icon"
          onClick={() => {budgetDelete(record)}}/>
        </div>
      )
    }
];

//delete handler

const budgetDelete = async (record) => {
  try {
    setLoading(true);
    await axios.post("/api/budget/delete-budget",  {budgetId:record._id})
    setLoading(false);
    message.success("Budget Deleted")
  } catch (error) {
    setLoading(false);
    console.error(error);
    message.error("Unable to delete Budget");
  }
}

  // form handling
  const handleSubmit = async (values) => {
    console.log(values)
    try {
      const decodedToken = getDecodedToken(); // Use the utility function
      if (decodedToken) {
        const userid = decodedToken._id;
        console.log("User ID:", userid);
        setLoading(true);
        //getting /budget from index.js backend
        if (editBudget) {
          await axios.post("/api/budget/edit-budget", {
            payload: {
              ...values,
              userid: userid,
            },
            budgetId : editBudget._id
          })
          setLoading(false);
          message.success("Budget Updated Successfully!")
          getAllBudget(); 
        } else {
          await axios.post('/api/budget/add-budget',
          {
              userid: userid,
              ...values
          })
          setLoading(false);
          message.success("Budget Added Successfully!")
        }

        setShowBudget(false);
        setEditBudget(null);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      message.error("Failed to add Budget");
    }
  };

  return (
    <div>
      {loading && <Spinner />}
      <div className="filters">
        <div>BUDGET</div>
        <div>
            <div className="mx-2" />
            <i className={`bi bi-table mx-2 bigger-icon ${viewBudget === 'tableBudget'}`} 
              onClick={() => setViewBudget('tableBudget')}></i>

           <i className={`bi bi-graph-up mx-2 bigger-icon ${viewBudget === 'chartBudget'}`} 
           onClick={() => setViewBudget('chartBudget')}></i>

           <i className={`bi bi-file-earmark-text mx-2 bigger-icon ${viewBudget === 'formBudget'}`} 
           onClick={() => setViewBudget('formBudget')}></i>

          </div>
        <div>
 
       {/*   <button
            className="btn btn-primary"
            onClick={() => setShowBudget(true)}
          >
            Add New
  </button> */}
        </div>
      </div>
      <div className="content">
    {(() => {
        switch (viewBudget) {
          case 'tableBudget':
            return (
              <div className="budget-page">
              <div className="table-container">
                <Table columns={columns} dataSource={allBudget} />
              </div>
              </div>
            );          
                case 'chartBudget':
                  return (
                      <div className="chart-container">
                          <div className="chart">
                              <ChartBudget allBudget={allBudget} allTransactions={allTransactions} />
                          </div>
                      </div>
                  );
            case 'formBudget':
                return (
                  
                  <div className="form-container">
                    <Form layout="vertical" onFinish={handleSubmit} initialValues={editBudget}>
                        <Form.Item label="Overall Budget" name="amount">
                            <Input type="number" placeholder="Enter overall budget amount" />
                        </Form.Item>
                        <Form.Item label="Food Budget" name={['categories', 'food']}>
                            <Input type="number" placeholder="Enter budget for food" />
                        </Form.Item>
                        <Form.Item label="Bills Budget" name={['categories', 'bills']}>
                            <Input type="number" placeholder="Enter budget for bills" />
                        </Form.Item>
                        <Form.Item label="Travelling Budget" name={['categories', 'travelling']}>
                            <Input type="number" placeholder="Enter budget for travelling" />
                        </Form.Item>
                        <Form.Item label="Medical Budget" name={['categories', 'medical']}>
                            <Input type="number" placeholder="Enter budget for medical expenses" />
                        </Form.Item>
                        <Form.Item label="Misc Budget" name={['categories', 'misc']}>
                            <Input type="number" placeholder="Enter budget for miscellaneous expenses" />
                        </Form.Item>
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                SAVE
                            </button>
                        </div>
                        
                    </Form>
                    </div>
                );
            default:
                return null;
                
        }
    })()}
    </div>
      {/* The Modal - Positioned outside of the switch-case */}
      <Modal
      title="Edit Budget"

      open={showBudget}
      onCancel={() => setShowBudget(false)}
      footer={false}
    >
      <Form layout="vertical" onFinish={handleSubmit} initialValues={editBudget}>
        {/* Copy all your form fields here */}
        <Form.Item label="Overall Budget" name="amount">
            <Input type="number" placeholder="Enter overall budget amount" />
        </Form.Item>
      
                        <Form.Item label="Food Budget" name={['categories', 'food']}>
                            <Input type="number" placeholder="Enter budget for food" />
                        </Form.Item>
                        <Form.Item label="Bills Budget" name={['categories', 'bills']}>
                            <Input type="number" placeholder="Enter budget for bills" />
                        </Form.Item>
                        <Form.Item label="Travelling Budget" name={['categories', 'travelling']}>
                            <Input type="number" placeholder="Enter budget for travelling" />
                        </Form.Item>
                        <Form.Item label="Medical Budget" name={['categories', 'medical']}>
                            <Input type="number" placeholder="Enter budget for medical expenses" />
                        </Form.Item>
                        <Form.Item label="Misc Budget" name={['categories', 'misc']}>
                            <Input type="number" placeholder="Enter budget for miscellaneous expenses" />
                        </Form.Item>
                        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary">
            SAVE
          </button>
        </div>
      </Form>
    </Modal>
  </div>
);

}
export default Budget;