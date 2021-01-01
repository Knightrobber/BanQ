<View>
				
				{	
					
					this.state.transactions.map((item,index)=>{
						
						<View style={{flexDirection:'column',justifyContent:'space-around',alignItems:'center',backgroundColor:'yellow'}}>
							{console.log("yo")}
							<View style={{flexDirection:'row'}}>
								<Text>{item.itemName} {console.log("niggaaaa")}</Text>
								<Text>{item.shopName}</Text>
							</View>
							<View style={{flexDirection:'row'}} >
								<Text>{item.date.getDate()} - {item.date.getMonth()+1} - {item.date.getYear()}</Text>
								<Text>{item.itemPartition}</Text>
							</View>
							<View>
								<Text>{item.itemPrice}</Text>
							</View>
						</View>
						

					})


				}
			</View>