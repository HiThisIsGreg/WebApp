<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
	 <xsl:output method="html"/> 
	 <xsl:template match="/">
		 <xsl:for-each select="//auction">
			<span class="c1">Item No:</span>
			<span class="c2"><xsl:value-of select="itemID"/></span>
			<span class="c1">Item Name:</span>
			<span class="c2"><xsl:value-of select="item"/></span>
			<span class="c1">Category:</span>
			<span class="c2"><xsl:value-of select="category"/></span>
			<span class="c1">Description:</span>
			<span class="c2">
				<xsl:choose>
					<xsl:when test="string-length(description) &lt; 30">
				<xsl:value-of select="substring(description,0)"/>
					</xsl:when>
					<xsl:otherwise>
				<xsl:value-of select="substring(description,0,31)"/>
					</xsl:otherwise>
				</xsl:choose>
			</span>
			<span class="c1">Buy it now price:</span>
			<span class="c2"><xsl:value-of select="buyPrice"/></span>
			<span class="c1">Current bid price:</span>
			<span class="c2"><xsl:value-of select="bid/bidPrice"/></span>
		
		 </xsl:for-each>
	 </xsl:template> 
</xsl:stylesheet>