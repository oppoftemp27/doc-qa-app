/**
 * Mock Data Module
 * Provides mock data for testing the application without connecting to actual services
 */

// Sample document texts for testing
const mockDocuments = {
    pdf: `EXECUTIVE SUMMARY
This document provides an overview of our quarterly financial performance and strategic initiatives. The company has shown strong growth in key markets while maintaining operational efficiency.

KEY FINDINGS
1. Revenue increased by 12% compared to the previous quarter
2. Operating expenses remained stable at 68% of revenue
3. Customer satisfaction scores improved by 7 percentage points
4. New product lines contributed 15% to overall revenue

RECOMMENDATIONS
- Increase investment in emerging markets
- Continue digital transformation initiatives
- Evaluate potential acquisition targets in complementary sectors

The board will convene next month to discuss the implementation timeline for these strategic recommendations.`,

    word: `Project Proposal: Digital Transformation Initiative

INTRODUCTION
This proposal outlines the scope, timeline, and resource requirements for the upcoming project. Our team has conducted extensive research to ensure the feasibility and alignment with organizational goals.

PROJECT SCOPE
The project encompasses three main phases:
1. Research and Planning (4 weeks)
2. Development and Testing (8 weeks)
3. Deployment and Evaluation (4 weeks)

BUDGET OVERVIEW
- Personnel: $120,000
- Equipment: $45,000
- Software licenses: $18,000
- Contingency: $25,000
- Total estimated cost: $208,000

EXPECTED OUTCOMES
- 25% reduction in processing time
- Improved data accuracy by 30%
- Enhanced user experience with a satisfaction rating of 4.5/5
- Return on investment within 18 months`,

    excel: `QUARTERLY SALES REPORT: FY2024-Q4

SALES BY REGION
Region | Q1 Sales | Q2 Sales | Q3 Sales | Q4 Sales | Total
-------------------------------------------------------
North  | $245,000 | $267,500 | $298,200 | $325,300 | $1,136,000
South  | $182,300 | $195,800 | $201,400 | $228,900 | $808,400
East   | $301,200 | $312,500 | $298,700 | $342,100 | $1,254,500
West   | $215,400 | $245,900 | $278,300 | $310,500 | $1,050,100
Total  | $944,900 | $1,021,700 | $1,076,600 | $1,206,800 | $4,249,000

TOP PERFORMING PRODUCTS
1. Product A: $857,300
2. Product B: $743,200
3. Product C: $652,100
4. Product D: $598,400
5. Product E: $512,000

The data indicates a strong upward trend in the western region, with a 14.7% growth rate compared to the previous fiscal year.`
};

// Sample responses for different question types
const mockResponses = {
    summary: {
        pdf: `Based on the document, here's a summary:

The document appears to be a financial report showing strong quarterly performance with 12% revenue growth compared to the previous quarter. Operating expenses remained stable at 68% of revenue, while customer satisfaction improved by 7 percentage points. New product lines contributed 15% to overall revenue.

The document also includes recommendations to increase investment in emerging markets, continue digital transformation initiatives, and evaluate potential acquisition targets in complementary sectors.`,
        
        word: `Based on the document, here's a summary:

This appears to be a project proposal document for a Digital Transformation Initiative that outlines a three-phase project:
1. Research and Planning (4 weeks)
2. Development and Testing (8 weeks)
3. Deployment and Evaluation (4 weeks)

The total estimated budget is $208,000, including personnel, equipment, software licenses, and contingency. The project aims to achieve a 25% reduction in processing time, improve data accuracy by 30%, and provide ROI within 18 months.`,
        
        excel: `Based on the document, here's a summary:

This is a quarterly sales report for FY2024-Q4 showing performance across four regions (North, South, East, and West) with total annual sales of $4,249,000. The East region was the highest performer with $1,254,500 in sales, followed by the North region with $1,136,000.

The report includes a list of top-performing products, with Product A leading at $857,300 in sales. The data shows a strong upward trend in the western region, with a 14.7% growth rate compared to the previous fiscal year.`
    },
    
    keyPoints: {
        pdf: `The main points in this document are:

1. Revenue increased by 12% compared to the previous quarter
2. Operating expenses remained stable at 68% of revenue
3. Customer satisfaction scores improved by 7 percentage points
4. New product lines contributed 15% to overall revenue

The document also mentions upcoming board discussions to implement strategic recommendations.`,
        
        word: `The main points in this document are:

1. The project follows a three-phase implementation over 16 weeks total
2. Total budget allocation of $208,000 with the largest portion ($120,000) going to personnel
3. Expected outcomes include 25% reduction in processing time and 30% improvement in data accuracy
4. The project is expected to achieve return on investment within 18 months

The document provides a comprehensive project plan with timeline and resource allocation.`,
        
        excel: `The main points in this document are:

1. Total annual sales across all regions reached $4,249,000
2. The East region was the top performer with $1,254,500 in total sales
3. Q4 showed the strongest performance with $1,206,800 in sales
4. Product A was the top-selling product with $857,300 in sales
5. The western region showed 14.7% growth compared to the previous year

The sales figures demonstrate an upward trend throughout the fiscal year.`
    },
    
    recommendations: {
        pdf: `The conclusions and recommendations in the document are:

RECOMMENDATIONS:
- Increase investment in emerging markets
- Continue digital transformation initiatives
- Evaluate potential acquisition targets in complementary sectors

The document states that the board will convene next month to discuss the implementation timeline for these strategic recommendations.`,
        
        word: `The expected outcomes and conclusions in the document are:

EXPECTED OUTCOMES:
- 25% reduction in processing time
- Improved data accuracy by 30%
- Enhanced user experience with a satisfaction rating of 4.5/5
- Return on investment within 18 months

These outcomes align with the project's goals and budget allocation of $208,000.`,
        
        excel: `The key conclusions from the sales report are:

1. The East region was the top performer with total sales of $1,254,500
2. There was consistent quarter-over-quarter growth across most regions
3. Q4 was the strongest performing quarter with $1,206,800 in sales
4. Product A significantly outperformed other products with $857,300 in sales
5. The western region showed particularly strong growth at 14.7% compared to the previous year

The data suggests focusing additional resources on the western region to capitalize on its growth trend while maintaining the strong performance in the East region.`
    },
    
    tablesCharts: {
        pdf: `The document does not appear to contain formal tables or charts in the sections I can access. However, it does present structured information in the KEY FINDINGS section:

1. Revenue increased by 12% compared to the previous quarter
2. Operating expenses remained stable at 68% of revenue
3. Customer satisfaction scores improved by 7 percentage points
4. New product lines contributed 15% to overall revenue

And in the RECOMMENDATIONS section:
- Increase investment in emerging markets
- Continue digital transformation initiatives
- Evaluate potential acquisition targets in complementary sectors`,
        
        word: `The document contains a budget breakdown that could be represented as a table:

BUDGET OVERVIEW
- Personnel: $120,000
- Equipment: $45,000
- Software licenses: $18,000
- Contingency: $25,000
- Total estimated cost: $208,000

While not formatted strictly as a table in the document, this information presents a structured breakdown of the budget allocations for the project.`,
        
        excel: `The document contains a sales table with the following structure:

SALES BY REGION
Region | Q1 Sales | Q2 Sales | Q3 Sales | Q4 Sales | Total
-------------------------------------------------------
North  | $245,000 | $267,500 | $298,200 | $325,300 | $1,136,000
South  | $182,300 | $195,800 | $201,400 | $228,900 | $808,400
East   | $301,200 | $312,500 | $298,700 | $342,100 | $1,254,500
West   | $215,400 | $245,900 | $278,300 | $310,500 | $1,050,100
Total  | $944,900 | $1,021,700 | $1,076,600 | $1,206,800 | $4,249,000

There's also a ranking of top-performing products:
1. Product A: $857,300
2. Product B: $743,200
3. Product C: $652,100
4. Product D: $598,400
5. Product E: $512,000

These tables show that the East region has the highest sales performance, and Product A is the top-selling product.`
    }
};
