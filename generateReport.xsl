<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
	 <xsl:output method="html"/> 
	 <xsl:template match="/">
		  <table>
		  <th>Item number</th><th>Item</th><th>Start Date</th><th>Start Time</th><th>Status</th><th>category</th><th>sellerID</th>
		  <th>Start Price</th><th>Reserve Price</th><th>Buy-it-Now Price</th><th>days</th><th>hours</th><th>minutes</th>
		  <th>Current Bid Price</th><th>Buyer ID</th><th>Revenue</th>
		 
		 <xsl:for-each select="//auction[status!='in_progress']">
			<tr>
				<td><xsl:value-of select="itemID"/></td>
				<td><xsl:value-of select="item"/></td>
				<td><xsl:value-of select="startDate"/></td>
				<td><xsl:value-of select="startTime"/></td>
				<td><xsl:value-of select="status"/></td>
				<td><xsl:value-of select="category"/></td>
				<td><xsl:value-of select="customerID"/></td>
				<td><xsl:value-of select="startPrice"/></td>
				<td><xsl:value-of select="reservePrice"/></td>
				<td><xsl:value-of select="buyPrice"/></td>
				<td><xsl:value-of select="duration/day"/></td>
				<td><xsl:value-of select="duration/hour"/></td>
				<td><xsl:value-of select="duration/min"/></td>
				<td><xsl:value-of select="bid/bidPrice"/></td>
				<td><xsl:value-of select="bid/custID"/></td>
				
					<xsl:choose>
						<xsl:when test="status='sold'">
							<td><xsl:value-of select="bid/bidPrice * 0.03"/></td>
							 
						</xsl:when>
						<xsl:otherwise>
							<td><xsl:value-of select="reservePrice * 0.01"/></td>
						
						</xsl:otherwise>
					</xsl:choose>
				
			</tr>
		 </xsl:for-each>
		 </table>
		 <table>
			<th>Total revenue</th>
			<th>Total failed</th>
			<th>Total sold</th>
			<tr>
				<td><xsl:value-of select="(sum(//auction[status='sold']/bid/bidPrice) * 0.03) + (sum(//auction[status='failed']/reservePrice) * 0.01)"/></td>
				<td><xsl:value-of select="count(//auction[status='failed'])" /></td>
				<td><xsl:value-of select="count(//auction[status='sold'])" /></td>
			</tr>
			
				
			
		 </table>
	 </xsl:template> 
</xsl:stylesheet>