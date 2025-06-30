
food_items = {}

total = 0

while True:
    food = input("Enter a food to buy or press 'q' to quit: ")
    if food.lower() == 'q':
        break
    else: 
        price = input("Enter the price of the food: R")
        try:
            price = float(price)
            food_items[food.strip()] = price
        except ValueError:
            print("Invalid price. Please enter a numeric value.")


print("\n#---- Shopping Cart ----#")
for item, price in food_items.items():
    print(f"{item}: R{price:.2f}")
    total += price


print(f"\nTotal: R{total:.2f}")

print("\n#---- Thank you for shopping with us! ----#")
print("#---- Please come again! ----#\n")
    