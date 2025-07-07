import calculator

length = float(input("Enter the length of the rectangle: "))
width = float(input("Enter the width of the rectangle: "))

print(f"\nYou entered length: {length} and width: {width} \n")

print(f"The area of the rectangle is: {calculator.area(length, width)}")
print(f"The perimeter of the rectangle is: {calculator.perimeter(length, width)}")